import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

export enum Role {
  USER = 'user',
  LABEL = 'label',
  ADMIN = 'admin',
}

// Каждая следующая роль включает права предыдущей
export const ROLE_LEVEL: Record<Role, number> = {
  [Role.USER]: 0,
  [Role.LABEL]: 1,
  [Role.ADMIN]: 2,
};

@Entity('users')
export class User {
  @PrimaryColumn({ type: 'varchar', length: 24 })
  id: string;

  @Column({ type: 'varchar', length: 320 })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar' })
  passwordHash: string;

  @Column({ name: 'display_name', type: 'varchar', length: 64 })
  displayName: string;

  @Column({ type: 'varchar', length: 16, default: Role.USER })
  role: Role;

  @Column({ name: 'email_verified_at', type: 'timestamptz', nullable: true })
  emailVerifiedAt: Date | null;

  // Путь вида image/<uuid>.jpg, пустая строка — аватара нет
  @Column({ type: 'varchar', default: '' })
  avatar: string;

  @Column({ name: 'totp_secret', type: 'varchar', nullable: true })
  totpSecret: string | null;

  @Column({ name: 'totp_enabled', type: 'boolean', default: false })
  totpEnabled: boolean;

  @Column({ name: 'banned_at', type: 'timestamptz', nullable: true })
  bannedAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
