import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { IsBoolean, IsIn, IsOptional, IsString, Length } from 'class-validator';
import { Auth, CurrentUser } from '../auth/auth.decorators';
import { Role, User } from '../users/entities/user.entity';
import { Label } from '../labels/entities/label.entity';
import { AuditService } from '../access/audit.service';
import { AuthService } from '../auth/auth.service';
import { SessionService } from '../auth/session.service';
import { generateId } from '../shared/object-id';

class UpdateUserDTO {
  @IsOptional()
  @IsIn(Object.values(Role))
  readonly role?: Role;

  @IsOptional()
  @IsBoolean()
  readonly banned?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly emailVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly resetTotp?: boolean;
}

class LabelDTO {
  @IsOptional()
  @IsString()
  @Length(1, 128)
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  // Пустая строка — отвязать владельца
  @IsOptional()
  @IsString()
  readonly ownerId?: string;
}

@Controller('/admin')
@Auth({ role: Role.ADMIN })
export class AdminController {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Label) private labelRepository: Repository<Label>,
    @InjectDataSource() private dataSource: DataSource,
    private auditService: AuditService,
    private authService: AuthService,
    private sessionService: SessionService,
  ) {}

  @Get('/stats')
  async stats() {
    const [totals] = await this.dataSource.query(`
      SELECT (SELECT count(*) FROM users)::int AS users,
             (SELECT count(*) FROM tracks)::int AS tracks,
             (SELECT count(*) FROM albums)::int AS albums,
             (SELECT count(*) FROM artists)::int AS artists,
             (SELECT count(*) FROM labels)::int AS labels,
             (SELECT count(*) FROM playlists)::int AS playlists,
             (SELECT count(*) FROM comments)::int AS comments,
             (SELECT count(*) FROM listens WHERE listened_at > now() - interval '30 days')::int AS "listens30d",
             (SELECT count(DISTINCT user_id) FROM listens WHERE listened_at > now() - interval '30 days')::int AS "listeners30d"
    `);
    const daily = await this.dataSource.query(`
      SELECT d::date AS day,
             (SELECT count(*) FROM listens WHERE listened_at::date = d::date)::int AS listens,
             (SELECT count(*) FROM users WHERE created_at::date = d::date)::int AS "newUsers"
      FROM generate_series(current_date - 29, current_date, interval '1 day') d
      ORDER BY d
    `);
    const topTracks = await this.dataSource.query(`
      SELECT t.id AS "_id", t.name, t.artist, count(l.id)::int AS listens
      FROM listens l JOIN tracks t ON t.id = l.track_id
      WHERE l.listened_at > now() - interval '30 days'
      GROUP BY t.id ORDER BY listens DESC LIMIT 10
    `);
    return { totals, daily, topTracks };
  }

  @Get('/users')
  async users(
    @Query('query') query?: string,
    @Query('offset') offset?: string,
  ) {
    const qb = this.userRepository
      .createQueryBuilder('user')
      .orderBy('user.created_at', 'DESC')
      .take(50)
      .skip(Number(offset) || 0);
    if (query) {
      qb.where('user.email ILIKE :query OR user.display_name ILIKE :query', {
        query: `%${query.replace(/[\\%_]/g, '\\$&')}%`,
      });
    }
    const [users, total] = await qb.getManyAndCount();
    const labels = await this.labelRepository.find();
    return {
      total,
      users: users.map((user) => {
        const label = labels.find((l) => l.ownerId === user.id);
        return {
          _id: user.id,
          email: user.email,
          displayName: user.displayName,
          role: user.role,
          emailVerified: !!user.emailVerifiedAt,
          totpEnabled: user.totpEnabled,
          banned: !!user.bannedAt,
          createdAt: user.createdAt,
          label: label ? { _id: label.id, name: label.name } : null,
        };
      }),
    };
  }

  @Patch('/users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDTO,
    @CurrentUser() admin: User,
  ) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('Пользователь не найден');
    if (user.id === admin.id && (dto.role || dto.banned)) {
      throw new BadRequestException(
        'Нельзя менять роль или блокировать самого себя',
      );
    }

    if (dto.role && dto.role !== user.role) {
      if (dto.role === Role.LABEL) {
        // У лейбла всегда есть запись в labels; если её нет — создаём по имени пользователя
        const existing = await this.labelRepository.findOneBy({
          ownerId: user.id,
        });
        if (!existing) {
          await this.labelRepository.insert({
            id: generateId(),
            name: user.displayName,
            ownerId: user.id,
          });
        }
      } else if (user.role === Role.LABEL) {
        // Лейбл остаётся вместе с артистами, просто без владельца
        await this.labelRepository.update(
          { ownerId: user.id },
          { ownerId: null },
        );
      }
      await this.auditService.log(admin, 'change_role', 'user', user.id, {
        email: user.email,
        from: user.role,
        to: dto.role,
      });
      user.role = dto.role;
    }
    if (dto.banned !== undefined && dto.banned !== !!user.bannedAt) {
      user.bannedAt = dto.banned ? new Date() : null;
      if (dto.banned) await this.sessionService.destroyAllForUser(user.id);
      await this.auditService.log(
        admin,
        dto.banned ? 'ban' : 'unban',
        'user',
        user.id,
        {
          email: user.email,
        },
      );
    }
    if (dto.emailVerified !== undefined) {
      user.emailVerifiedAt = dto.emailVerified
        ? (user.emailVerifiedAt ?? new Date())
        : null;
    }
    await this.userRepository.save(user);
    if (dto.resetTotp) {
      await this.authService.resetTotp(user);
      await this.auditService.log(admin, 'reset_2fa', 'user', user.id, {
        email: user.email,
      });
    }
    return { ok: true };
  }

  @Get('/labels')
  async labels() {
    const rows = await this.dataSource.query(`
      SELECT l.id, l.name, l.description, l.logo, l.created_at,
             u.id AS owner_id, u.email AS owner_email, u.display_name AS owner_name,
             (SELECT count(*) FROM artists a WHERE a.label_id = l.id)::int AS artists_count
      FROM labels l LEFT JOIN users u ON u.id = l.owner_id
      ORDER BY lower(l.name)
    `);
    return rows.map((row) => ({
      _id: row.id,
      name: row.name,
      description: row.description,
      logo: row.logo,
      createdAt: row.created_at,
      artistsCount: row.artists_count,
      owner: row.owner_id
        ? {
            _id: row.owner_id,
            email: row.owner_email,
            displayName: row.owner_name,
          }
        : null,
    }));
  }

  private async assignOwner(labelId: string, ownerId: string) {
    const owner = await this.userRepository.findOneBy({ id: ownerId });
    if (!owner) throw new BadRequestException('Пользователь не найден');
    if (owner.role === Role.ADMIN) {
      throw new BadRequestException(
        'Администратор не может быть владельцем лейбла',
      );
    }
    const other = await this.labelRepository.findOneBy({ ownerId });
    if (other && other.id !== labelId) {
      throw new BadRequestException(
        'Этот пользователь уже владеет другим лейблом',
      );
    }
    // Прежний владелец этого лейбла становится обычным пользователем
    const label = await this.labelRepository.findOneBy({ id: labelId });
    if (label?.ownerId && label.ownerId !== ownerId) {
      await this.userRepository.update(
        { id: label.ownerId },
        { role: Role.USER },
      );
    }
    await this.labelRepository.update({ id: labelId }, { ownerId });
    await this.userRepository.update({ id: ownerId }, { role: Role.LABEL });
  }

  @Post('/labels')
  async createLabel(@Body() dto: LabelDTO, @CurrentUser() admin: User) {
    if (!dto.name?.trim()) throw new BadRequestException('Укажите название');
    const id = generateId();
    await this.labelRepository.insert({
      id,
      name: dto.name.trim(),
      description: dto.description ?? '',
    });
    if (dto.ownerId) await this.assignOwner(id, dto.ownerId);
    await this.auditService.log(admin, 'create', 'label', id, {
      name: dto.name,
    });
    return { _id: id };
  }

  @Patch('/labels/:id')
  async updateLabel(
    @Param('id') id: string,
    @Body() dto: LabelDTO,
    @CurrentUser() admin: User,
  ) {
    const label = await this.labelRepository.findOneBy({ id });
    if (!label) throw new NotFoundException('Лейбл не найден');
    const patch: Partial<Label> = {};
    if (dto.name?.trim()) patch.name = dto.name.trim();
    if (dto.description !== undefined) patch.description = dto.description;
    if (Object.keys(patch).length)
      await this.labelRepository.update({ id }, patch);
    if (dto.ownerId !== undefined) {
      if (dto.ownerId) {
        await this.assignOwner(id, dto.ownerId);
      } else if (label.ownerId) {
        await this.userRepository.update(
          { id: label.ownerId },
          { role: Role.USER },
        );
        await this.labelRepository.update({ id }, { ownerId: null });
      }
    }
    await this.auditService.log(admin, 'update', 'label', id, { ...dto });
    return { ok: true };
  }

  @Delete('/labels/:id')
  async deleteLabel(@Param('id') id: string, @CurrentUser() admin: User) {
    const label = await this.labelRepository.findOneBy({ id });
    if (!label) throw new NotFoundException('Лейбл не найден');
    if (label.ownerId) {
      await this.userRepository.update(
        { id: label.ownerId },
        { role: Role.USER },
      );
    }
    // Артисты остаются, у них просто не будет лейбла
    await this.labelRepository.delete({ id });
    await this.auditService.log(admin, 'delete', 'label', id, {
      name: label.name,
    });
    return { ok: true };
  }

  @Get('/audit')
  audit(@Query('offset') offset?: string) {
    return this.auditService.list(100, Number(offset) || 0);
  }
}
