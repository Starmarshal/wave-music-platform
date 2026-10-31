import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Request, Response } from 'express';
import { Session } from './entities/session.entity';
import { User } from '../users/entities/user.entity';
import { generateId } from '../shared/object-id';
import { randomToken, sha256 } from './crypto';

export const SESSION_COOKIE = 'sid';
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
// Пароль введён, 2FA ещё нет: на ввод кода даём 10 минут
const PENDING_TTL_MS = 10 * 60 * 1000;
// Не обновляем last_used_at на каждый запрос
const TOUCH_INTERVAL_MS = 10 * 60 * 1000;

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session) private sessionRepository: Repository<Session>,
  ) {}

  async create(
    user: User,
    mfaPassed: boolean,
    req: Request,
    res: Response,
  ): Promise<Session> {
    const token = randomToken();
    const now = Date.now();
    const session = await this.sessionRepository.save(
      this.sessionRepository.create({
        id: generateId(),
        userId: user.id,
        tokenHash: sha256(token),
        mfaPassed,
        userAgent: (req.headers['user-agent'] || '').slice(0, 512),
        ip: req.ip?.slice(0, 64) ?? null,
        lastUsedAt: new Date(now),
        expiresAt: new Date(
          now + (mfaPassed ? SESSION_TTL_MS : PENDING_TTL_MS),
        ),
      }),
    );
    this.setCookie(res, token);
    return session;
  }

  async completeMfa(session: Session) {
    session.mfaPassed = true;
    session.expiresAt = new Date(Date.now() + SESSION_TTL_MS);
    await this.sessionRepository.save(session);
  }

  // Возвращает действующую сессию с пользователем или null
  async resolve(token: string | undefined): Promise<Session | null> {
    if (!token) return null;
    const session = await this.sessionRepository.findOne({
      where: { tokenHash: sha256(token) },
      relations: { user: true },
    });
    if (!session || session.expiresAt.getTime() < Date.now()) return null;
    if (session.user.bannedAt) return null;

    // Скользящий срок: активная сессия продлевается
    if (
      session.mfaPassed &&
      Date.now() - session.lastUsedAt.getTime() > TOUCH_INTERVAL_MS
    ) {
      session.lastUsedAt = new Date();
      session.expiresAt = new Date(Date.now() + SESSION_TTL_MS);
      await this.sessionRepository.update(session.id, {
        lastUsedAt: session.lastUsedAt,
        expiresAt: session.expiresAt,
      });
    }
    return session;
  }

  async destroy(sessionId: string, res: Response) {
    await this.sessionRepository.delete({ id: sessionId });
    this.clearCookie(res);
  }

  async destroyAllForUser(userId: string, exceptSessionId?: string) {
    const query = this.sessionRepository
      .createQueryBuilder()
      .delete()
      .where('user_id = :userId', { userId });
    if (exceptSessionId) {
      query.andWhere('id <> :exceptSessionId', { exceptSessionId });
    }
    await query.execute();
  }

  listForUser(userId: string) {
    return this.sessionRepository.find({
      where: { userId, mfaPassed: true },
      order: { lastUsedAt: 'DESC' },
    });
  }

  async destroyForUser(userId: string, sessionId: string) {
    await this.sessionRepository.delete({ id: sessionId, userId });
  }

  private cookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: 'lax' as const,
      path: '/',
    };
  }

  setCookie(res: Response, token: string) {
    res.cookie(SESSION_COOKIE, token, {
      ...this.cookieOptions(),
      maxAge: SESSION_TTL_MS,
    });
  }

  clearCookie(res: Response) {
    res.clearCookie(SESSION_COOKIE, this.cookieOptions());
  }
}
