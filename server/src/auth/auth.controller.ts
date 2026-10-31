import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';
import {
  Auth,
  AuthRequest,
  CurrentSession,
  CurrentUser,
} from './auth.decorators';
import {
  ChangePasswordDTO,
  CodeDTO,
  DisableTotpDTO,
  EmailDTO,
  LoginDTO,
  LogoutDTO,
  RegisterDTO,
  ResetPasswordDTO,
  TokenDTO,
  UpdateProfileDTO,
} from './dto/auth.dto';
import { User } from '../users/entities/user.entity';
import { Session } from './entities/session.entity';

// Жёсткий лимит на подбор паролей и кодов: 5 попыток в минуту с одного IP
const STRICT_LIMIT = { default: { limit: 5, ttl: 60_000 } };

@Controller('/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
  ) {}

  @Get('/me')
  async me(@Req() req: Request & AuthRequest) {
    return {
      user: req.user ? await this.authService.serializeUser(req.user) : null,
      mfaPending: !req.user && !!req.pendingSession,
    };
  }

  @Post('/register')
  @Throttle(STRICT_LIMIT)
  async register(
    @Body() dto: RegisterDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.register(
      dto.email,
      dto.password,
      dto.displayName,
    );
    await this.sessionService.create(user, true, req, res);
    return { user: await this.authService.serializeUser(user) };
  }

  @Post('/login')
  @HttpCode(200)
  @Throttle(STRICT_LIMIT)
  async login(
    @Body() dto: LoginDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.checkCredentials(
      dto.email,
      dto.password,
    );
    await this.sessionService.create(user, !user.totpEnabled, req, res);
    if (user.totpEnabled) {
      return { mfaRequired: true };
    }
    return { user: await this.authService.serializeUser(user) };
  }

  @Post('/login/2fa')
  @HttpCode(200)
  @Throttle(STRICT_LIMIT)
  async loginSecondFactor(
    @Body() dto: CodeDTO,
    @Req() req: Request & AuthRequest,
  ) {
    const session = req.pendingSession;
    if (!session) {
      throw new UnauthorizedException('Сначала введите почту и пароль');
    }
    if (!(await this.authService.verifySecondFactor(session.user, dto.code))) {
      throw new BadRequestException('Неверный код');
    }
    await this.sessionService.completeMfa(session);
    return { user: await this.authService.serializeUser(session.user) };
  }

  @Post('/logout')
  @HttpCode(200)
  async logout(
    @Body() dto: LogoutDTO,
    @Req() req: Request & AuthRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const session = req.session ?? req.pendingSession;
    if (session && dto.everywhere) {
      await this.sessionService.destroyAllForUser(session.userId);
    }
    if (session) {
      await this.sessionService.destroy(session.id, res);
    } else {
      this.sessionService.clearCookie(res);
    }
    return { ok: true };
  }

  @Post('/verify-email')
  @HttpCode(200)
  @Throttle(STRICT_LIMIT)
  async verifyEmail(@Body() dto: TokenDTO) {
    await this.authService.verifyEmail(dto.token);
    return { ok: true };
  }

  @Post('/resend-verification')
  @HttpCode(200)
  @Auth({ allowUnverified: true })
  @Throttle({ default: { limit: 2, ttl: 60_000 } })
  async resendVerification(@CurrentUser() user: User) {
    await this.authService.sendEmailVerification(user);
    return { ok: true };
  }

  @Post('/forgot-password')
  @HttpCode(200)
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  async forgotPassword(@Body() dto: EmailDTO) {
    await this.authService.requestPasswordReset(dto.email);
    return { ok: true };
  }

  @Post('/reset-password')
  @HttpCode(200)
  @Throttle(STRICT_LIMIT)
  async resetPassword(@Body() dto: ResetPasswordDTO) {
    const user = await this.authService.resetPassword(dto.token, dto.password);
    // Пароль сменился — все сессии, включая возможную чужую, завершаются
    await this.sessionService.destroyAllForUser(user.id);
    return { ok: true };
  }

  @Post('/change-password')
  @HttpCode(200)
  @Auth({ allowUnverified: true })
  @Throttle(STRICT_LIMIT)
  async changePassword(
    @Body() dto: ChangePasswordDTO,
    @CurrentUser() user: User,
    @CurrentSession() session: Session,
  ) {
    await this.authService.changePassword(
      user,
      dto.currentPassword,
      dto.newPassword,
    );
    await this.sessionService.destroyAllForUser(user.id, session.id);
    return { ok: true };
  }

  @Patch('/profile')
  @Auth({ allowUnverified: true })
  async updateProfile(
    @Body() dto: UpdateProfileDTO,
    @CurrentUser() user: User,
  ) {
    const updated = await this.authService.updateProfile(user, dto.displayName);
    return { user: await this.authService.serializeUser(updated) };
  }

  @Get('/sessions')
  @Auth({ allowUnverified: true })
  async sessions(
    @CurrentUser() user: User,
    @CurrentSession() current: Session,
  ) {
    const sessions = await this.sessionService.listForUser(user.id);
    return sessions.map((session) => ({
      _id: session.id,
      userAgent: session.userAgent,
      ip: session.ip,
      createdAt: session.createdAt,
      lastUsedAt: session.lastUsedAt,
      current: session.id === current.id,
    }));
  }

  @Delete('/sessions/:id')
  @Auth({ allowUnverified: true })
  async destroySession(@Param('id') id: string, @CurrentUser() user: User) {
    await this.sessionService.destroyForUser(user.id, id);
    return { ok: true };
  }

  @Get('/2fa')
  @Auth({ allowUnverified: true })
  async totpStatus(@CurrentUser() user: User) {
    return {
      enabled: user.totpEnabled,
      backupCodesLeft: user.totpEnabled
        ? await this.authService.countBackupCodes(user)
        : 0,
    };
  }

  @Post('/2fa/setup')
  @HttpCode(200)
  @Auth({ allowUnverified: true })
  setupTotp(@CurrentUser() user: User) {
    return this.authService.startTotpSetup(user);
  }

  @Post('/2fa/enable')
  @HttpCode(200)
  @Auth({ allowUnverified: true })
  @Throttle(STRICT_LIMIT)
  async enableTotp(@Body() dto: CodeDTO, @CurrentUser() user: User) {
    const backupCodes = await this.authService.enableTotp(user, dto.code);
    return { backupCodes };
  }

  @Post('/2fa/disable')
  @HttpCode(200)
  @Auth({ allowUnverified: true })
  @Throttle(STRICT_LIMIT)
  async disableTotp(@Body() dto: DisableTotpDTO, @CurrentUser() user: User) {
    await this.authService.disableTotp(user, dto.password, dto.code);
    return { ok: true };
  }

  @Post('/2fa/backup-codes')
  @HttpCode(200)
  @Auth({ allowUnverified: true })
  @Throttle(STRICT_LIMIT)
  async regenerateBackupCodes(@Body() dto: CodeDTO, @CurrentUser() user: User) {
    if (
      !user.totpEnabled ||
      !(await this.authService.verifySecondFactor(user, dto.code))
    ) {
      throw new BadRequestException('Неверный код');
    }
    return { backupCodes: await this.authService.regenerateBackupCodes(user) };
  }
}
