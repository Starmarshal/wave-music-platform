import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ArtistsService } from './artists.service';
import { Auth, CurrentUser } from '../auth/auth.decorators';
import { Role, User } from '../users/entities/user.entity';
import { AccessService } from '../access/access.service';
import { AuditService } from '../access/audit.service';
import { FileService, FileType, IMAGE_LIMITS } from '../file/file.service';
import { serializeArtist } from '../shared/serializers';

@Controller('/artists')
export class ArtistsController {
  constructor(
    private artistsService: ArtistsService,
    private accessService: AccessService,
    private auditService: AuditService,
    private fileService: FileService,
  ) {}

  @Get()
  list(@Query('query') query?: string, @Query('labelId') labelId?: string) {
    return this.artistsService.list(query, labelId);
  }

  @Get(':slug')
  getCard(@Param('slug') slug: string) {
    return this.artistsService.getCard(slug);
  }

  @Get(':id/stats')
  @Auth({ role: Role.LABEL })
  async stats(
    @Param('id') id: string,
    @Query('days') days: string,
    @CurrentUser() user: User,
  ) {
    await this.accessService.assertCanManageArtists(user, [id]);
    return this.artistsService.dailyStats(
      id,
      Math.min(Math.max(Number(days) || 30, 1), 365),
    );
  }

  @Post()
  @Auth({ role: Role.LABEL })
  @UseInterceptors(FileInterceptor('photo', { limits: IMAGE_LIMITS }))
  async create(
    @UploadedFile() photo,
    @Body() body: Record<string, string>,
    @CurrentUser() user: User,
  ) {
    // Лейбл создаёт артистов только в свой лейбл, админ — в любой или без лейбла
    const labelId = this.accessService.isAdmin(user)
      ? body.labelId || null
      : await this.accessService.labelIdOf(user);
    if (!this.accessService.isAdmin(user) && !labelId) {
      throw new BadRequestException('Ваш аккаунт не привязан к лейблу');
    }
    const artist = await this.artistsService.create({
      name: body.name,
      bio: body.bio,
      labelId,
      photo: photo ? this.fileService.createFile(FileType.IMAGE, photo) : '',
    });
    await this.auditService.log(user, 'create', 'artist', artist.id, {
      name: artist.name,
    });
    return serializeArtist(artist);
  }

  @Patch(':id')
  @Auth({ role: Role.LABEL })
  @UseInterceptors(FileInterceptor('photo', { limits: IMAGE_LIMITS }))
  async update(
    @Param('id') id: string,
    @UploadedFile() photo,
    @Body() body: Record<string, string>,
    @CurrentUser() user: User,
  ) {
    await this.accessService.assertCanManageArtists(user, [id]);
    const artist = await this.artistsService.update(id, {
      name: body.name,
      bio: body.bio,
      // Переводить артиста между лейблами может только админ
      labelId:
        this.accessService.isAdmin(user) && body.labelId !== undefined
          ? body.labelId || null
          : undefined,
      photo: photo
        ? this.fileService.createFile(FileType.IMAGE, photo)
        : undefined,
    });
    await this.auditService.log(user, 'update', 'artist', id, {
      name: artist.name,
    });
    return serializeArtist(artist);
  }

  @Delete(':id')
  @Auth({ role: Role.LABEL })
  async delete(@Param('id') id: string, @CurrentUser() user: User) {
    await this.accessService.assertCanManageArtists(user, [id]);
    const artist = await this.artistsService.findOne(id);
    await this.artistsService.delete(id);
    await this.auditService.log(user, 'delete', 'artist', id, {
      name: artist.name,
    });
    return { ok: true };
  }
}
