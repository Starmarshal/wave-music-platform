import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('backup_codes')
export class BackupCode {
  @PrimaryColumn({ type: 'varchar', length: 24 })
  id: string;

  @Column({ name: 'user_id', type: 'varchar', length: 24 })
  userId: string;

  @Column({ name: 'code_hash', type: 'varchar', length: 64 })
  codeHash: string;

  @Column({ name: 'used_at', type: 'timestamptz', nullable: true })
  usedAt: Date | null;
}
