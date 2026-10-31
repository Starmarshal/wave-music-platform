import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Label } from '../../labels/entities/label.entity';

@Entity('artists')
export class Artist {
  @PrimaryColumn({ type: 'varchar', length: 24 })
  id: string;

  @Column({ type: 'varchar', length: 128 })
  name: string;

  @Column({ type: 'varchar', length: 160 })
  slug: string;

  @Column({ type: 'text', default: '' })
  bio: string;

  @Column({ type: 'varchar', default: '' })
  photo: string;

  @Column({ name: 'label_id', type: 'varchar', length: 24, nullable: true })
  labelId: string | null;

  @ManyToOne(() => Label, (label) => label.artists, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'label_id' })
  label: Label | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
