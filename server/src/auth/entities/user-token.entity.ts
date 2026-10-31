import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

export enum UserTokenType {
  VERIFY_EMAIL = 'verify_email',
  RESET_PASSWORD = 'reset_password',
}

@Entity('user_tokens')
export class UserToken {
  @PrimaryColumn({ type: 'varchar', length: 24 })
  id: string;

  @Column({ name: 'user_id', type: 'varchar', length: 24 })
  userId: string;

  @Column({ type: 'varchar', length: 32 })
  type: UserTokenType;

  @Column({ name: 'token_hash', type: 'varchar', length: 64 })
  tokenHash: string;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @Column({ name: 'used_at', type: 'timestamptz', nullable: true })
  usedAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
