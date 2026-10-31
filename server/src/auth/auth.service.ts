import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  OnApplicationBootstrap,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThan, Repository } from 'typeorm';
import { Role, User } from '../users/entities/user.entity';
import { UserToken, UserTokenType } from './entities/user-token.entity';
import { BackupCode } from './entities/backup-code.entity';
import { Label } from '../labels/entities/label.entity';
import { MailService } from '../mail/mail.service';
import { generateId } from '../shared/object-id';
import {
  generateBackupCode,
  generateTotpSecret,
  hashPassword,
  normalizeBackupCode,
  randomToken,
  sha256,
  totpAuthUrl,
  verifyPassword,
  verifyTotp,
} from './crypto';

const VERIFY_EMAIL_TTL_MS = 24 * 60 * 60 * 1000;
const RESET_PASSWORD_TTL_MS = 60 * 60 * 1000;
const BACKUP_CODES_COUNT = 10;

@Injectable()
export class AuthService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserToken)
    private tokenRepository: Repository<UserToken>,
    @InjectRepository(BackupCode)
    private backupCodeRepository: Repository<BackupCode>,
    @InjectRepository(Label) private labelRepository: Repository<Label>,
    private mailService: MailService,
  ) {}

  // Первый админ создаётся из ADMIN_EMAIL / ADMIN_PASSWORD, если его ещё нет
  async onApplicationBootstrap() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) return;
    if (await this.findByEmail(email)) return;
    await this.userRepository.save(
      this.userRepository.create({
        id: generateId(),
        email,
        passwordHash: await hashPassword(password),
        displayName: process.env.ADMIN_NAME || 'Admin',
        role: Role.ADMIN,
        emailVerifiedAt: new Date(),
      }),
    );
    this.logger.log(`Admin account ${email} created`);
  }

  findByEmail(email: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .where('lower(user.email) = lower(:email)', { email: email.trim() })
      .getOne();
  }

  async serializeUser(user: User) {
    const label =
      user.role === Role.LABEL
        ? await this.labelRepository.findOneBy({ ownerId: user.id })
        : null;
    return {
      _id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      emailVerified: !!user.emailVerifiedAt,
      totpEnabled: user.totpEnabled,
      label: label ? { _id: label.id, name: label.name } : null,
    };
  }

  async register(email: string, password: string, displayName: string) {
    if (await this.findByEmail(email)) {
      throw new ConflictException('Пользователь с такой почтой уже есть');
    }
    const user = await this.userRepository.save(
      this.userRepository.create({
        id: generateId(),
        email: email.trim(),
        passwordHash: await hashPassword(password),
        displayName: displayName.trim(),
        role: Role.USER,
      }),
    );
    await this.sendEmailVerification(user);
    return user;
  }

  async checkCredentials(email: string, password: string) {
    const user = await this.findByEmail(email);
    // Хэшируем даже при несуществующем email, чтобы по времени ответа нельзя было узнать о наличии аккаунта
    const valid = user
      ? await verifyPassword(password, user.passwordHash)
      : (await hashPassword(password), false);
    if (!user || !valid) {
      throw new UnauthorizedException('Неверная почта или пароль');
    }
    if (user.bannedAt) {
      throw new ForbiddenException('Аккаунт заблокирован');
    }
    return user;
  }

  // Код из приложения или одноразовый резервный код
  async verifySecondFactor(user: User, code: string) {
    if (user.totpSecret && verifyTotp(user.totpSecret, code)) return true;
    const normalized = normalizeBackupCode(code);
    if (normalized.length !== 10) return false;
    const backupCode = await this.backupCodeRepository.findOneBy({
      userId: user.id,
      codeHash: sha256(normalized),
      usedAt: IsNull(),
    });
    if (!backupCode) return false;
    backupCode.usedAt = new Date();
    await this.backupCodeRepository.save(backupCode);
    return true;
  }

  private async createToken(user: User, type: UserTokenType, ttlMs: number) {
    // Старые неиспользованные токены этого типа больше не действуют
    await this.tokenRepository.delete({
      userId: user.id,
      type,
      usedAt: IsNull(),
    });
    const token = randomToken();
    await this.tokenRepository.save(
      this.tokenRepository.create({
        id: generateId(),
        userId: user.id,
        type,
        tokenHash: sha256(token),
        expiresAt: new Date(Date.now() + ttlMs),
      }),
    );
    return token;
  }

  private async consumeToken(token: string, type: UserTokenType) {
    const record = await this.tokenRepository.findOneBy({
      tokenHash: sha256(token),
      type,
      usedAt: IsNull(),
      expiresAt: MoreThan(new Date()),
    });
    if (!record) {
      throw new BadRequestException('Ссылка недействительна или устарела');
    }
    record.usedAt = new Date();
    await this.tokenRepository.save(record);
    const user = await this.userRepository.findOneByOrFail({
      id: record.userId,
    });
    return user;
  }

  async sendEmailVerification(user: User) {
    if (user.emailVerifiedAt) return;
    const token = await this.createToken(
      user,
      UserTokenType.VERIFY_EMAIL,
      VERIFY_EMAIL_TTL_MS,
    );
    await this.mailService.sendEmailVerification(user.email, token);
  }

  async verifyEmail(token: string) {
    const user = await this.consumeToken(token, UserTokenType.VERIFY_EMAIL);
    user.emailVerifiedAt = user.emailVerifiedAt ?? new Date();
    return this.userRepository.save(user);
  }

  async requestPasswordReset(email: string) {
    const user = await this.findByEmail(email);
    // Ответ одинаковый в любом случае — не раскрываем, есть ли такой аккаунт
    if (!user || user.bannedAt) return;
    const token = await this.createToken(
      user,
      UserTokenType.RESET_PASSWORD,
      RESET_PASSWORD_TTL_MS,
    );
    await this.mailService.sendPasswordReset(user.email, token);
  }

  async resetPassword(token: string, password: string) {
    const user = await this.consumeToken(token, UserTokenType.RESET_PASSWORD);
    user.passwordHash = await hashPassword(password);
    // Письмо пришло на почту — значит, она подтверждена
    user.emailVerifiedAt = user.emailVerifiedAt ?? new Date();
    return this.userRepository.save(user);
  }

  async changePassword(
    user: User,
    currentPassword: string,
    newPassword: string,
  ) {
    if (!(await verifyPassword(currentPassword, user.passwordHash))) {
      throw new BadRequestException('Текущий пароль указан неверно');
    }
    user.passwordHash = await hashPassword(newPassword);
    await this.userRepository.save(user);
  }

  async updateProfile(user: User, displayName?: string) {
    if (displayName) user.displayName = displayName.trim();
    return this.userRepository.save(user);
  }

  // Шаг 1 включения 2FA: секрет сохраняется, но не действует до подтверждения кодом
  async startTotpSetup(user: User) {
    if (user.totpEnabled) {
      throw new BadRequestException(
        'Двухфакторная аутентификация уже включена',
      );
    }
    user.totpSecret = generateTotpSecret();
    await this.userRepository.save(user);
    return {
      secret: user.totpSecret,
      otpauthUrl: totpAuthUrl(user.totpSecret, user.email, 'Wave music'),
    };
  }

  async enableTotp(user: User, code: string) {
    if (user.totpEnabled) {
      throw new BadRequestException(
        'Двухфакторная аутентификация уже включена',
      );
    }
    if (!user.totpSecret || !verifyTotp(user.totpSecret, code)) {
      throw new BadRequestException('Неверный код');
    }
    user.totpEnabled = true;
    await this.userRepository.save(user);
    return this.regenerateBackupCodes(user);
  }

  async disableTotp(user: User, password: string, code: string) {
    if (user.role !== Role.USER) {
      throw new ForbiddenException(
        'Для лейбла и администратора двухфакторная аутентификация обязательна',
      );
    }
    if (!(await verifyPassword(password, user.passwordHash))) {
      throw new BadRequestException('Неверный пароль');
    }
    if (!(await this.verifySecondFactor(user, code))) {
      throw new BadRequestException('Неверный код');
    }
    await this.resetTotp(user);
  }

  // Используется и админом, если пользователь потерял телефон и коды
  async resetTotp(user: User) {
    user.totpEnabled = false;
    user.totpSecret = null;
    await this.userRepository.save(user);
    await this.backupCodeRepository.delete({ userId: user.id });
  }

  async regenerateBackupCodes(user: User) {
    await this.backupCodeRepository.delete({ userId: user.id });
    const codes = Array.from(
      { length: BACKUP_CODES_COUNT },
      generateBackupCode,
    );
    await this.backupCodeRepository.save(
      codes.map((code) =>
        this.backupCodeRepository.create({
          id: generateId(),
          userId: user.id,
          codeHash: sha256(normalizeBackupCode(code)),
        }),
      ),
    );
    return codes;
  }

  countBackupCodes(user: User) {
    return this.backupCodeRepository.countBy({
      userId: user.id,
      usedAt: IsNull(),
    });
  }
}
