import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('sessions')
export class Session {
  @PrimaryColumn({ type: 'varchar', length: 24 })
  id: string;

  @Column({ name: 'user_id', type: 'varchar', length: 24 })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // В БД хранится только sha256 от токена из cookie
  @Column({ name: 'token_hash', type: 'varchar', length: 64 })
  tokenHash: string;

  // false — пароль введён, но код 2FA ещё нет
  @Column({ name: 'mfa_passed', type: 'boolean', default: false })
  mfaPassed: boolean;

  @Column({ name: 'user_agent', type: 'varchar', length: 512, nullable: true })
  userAgent: string | null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  ip: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ name: 'last_used_at', type: 'timestamptz' })
  lastUsedAt: Date;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;
}
