import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { AUTH_KEY, AuthOptions, AuthRequest } from './auth.decorators';
import { SESSION_COOKIE, SessionService } from './session.service';
import { Role, ROLE_LEVEL } from '../users/entities/user.entity';

// Глобальный guard: на каждом запросе определяет пользователя по cookie,
// а на эндпоинтах с @Auth() проверяет вход, почту, роль и 2FA
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private sessionService: SessionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() !== 'http') return true;
    const req = context.switchToHttp().getRequest<Request & AuthRequest>();

    const session = await this.sessionService.resolve(
      req.cookies?.[SESSION_COOKIE],
    );
    if (session?.mfaPassed) {
      req.session = session;
      req.user = session.user;
    } else if (session) {
      req.pendingSession = session;
    }

    const options = this.reflector.getAllAndOverride<AuthOptions | undefined>(
      AUTH_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!options) return true;

    const user = req.user;
    if (!user) {
      throw new UnauthorizedException({
        code: 'AUTH_REQUIRED',
        message: 'Войдите в аккаунт',
      });
    }
    if (!options.allowUnverified && !user.emailVerifiedAt) {
      throw new ForbiddenException({
        code: 'EMAIL_NOT_VERIFIED',
        message: 'Подтвердите почту',
      });
    }
    if (options.role) {
      if (ROLE_LEVEL[user.role] < ROLE_LEVEL[options.role]) {
        throw new ForbiddenException({
          code: 'FORBIDDEN',
          message: 'Недостаточно прав',
        });
      }
      if (
        ROLE_LEVEL[options.role] >= ROLE_LEVEL[Role.LABEL] &&
        !user.totpEnabled
      ) {
        throw new ForbiddenException({
          code: 'MFA_SETUP_REQUIRED',
          message: 'Для этого действия включите двухфакторную аутентификацию',
        });
      }
    }
    return true;
  }
}
