import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Role, User } from '../users/entities/user.entity';
import { Session } from './entities/session.entity';

export interface AuthOptions {
  // Минимальная роль; label и admin дополнительно требуют включённую 2FA
  role?: Role;
  // Разрешить вход без подтверждённой почты (настройки профиля и т.п.)
  allowUnverified?: boolean;
}

export const AUTH_KEY = 'auth';

// Эндпоинт доступен только вошедшим пользователям
export const Auth = (options: AuthOptions = {}) =>
  SetMetadata(AUTH_KEY, options);

export interface AuthRequest {
  user?: User;
  session?: Session;
  // Сессия, у которой пароль введён, а код 2FA ещё нет
  pendingSession?: Session;
}

// Текущий пользователь или undefined, если эндпоинт публичный и вход не выполнен
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) =>
    ctx.switchToHttp().getRequest<AuthRequest>().user,
);

export const CurrentSession = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) =>
    ctx.switchToHttp().getRequest<AuthRequest>().session,
);
