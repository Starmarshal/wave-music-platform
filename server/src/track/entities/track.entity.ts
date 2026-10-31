import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Comment } from './comment.entity';
import { TrackArtist } from '../../artists/entities/track-artist.entity';

@Entity('tracks')
export class Track {
  // 24-символьный hex: старые записи сохраняют свои MongoDB ObjectId
  @PrimaryColumn({ type: 'varchar', length: 24 })
  id: string;

  @Column({ type: 'varchar', default: '' })
  name: string;

  @Column({ type: 'varchar', default: '' })
  artist: string;

  @Column({ type: 'text', default: '' })
  text: string;

  @Column({ type: 'integer', default: 0 })
  listens: number;

  @Column({ type: 'varchar', default: '' })
  picture: string;

  @Column({ type: 'varchar', default: '' })
  audio: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ name: 'created_by', type: 'varchar', length: 24, nullable: true })
  createdBy: string | null;

  @OneToMany(() => Comment, (comment) => comment.track)
  comments: Comment[];

  @OneToMany(() => TrackArtist, (trackArtist) => trackArtist.track)
  trackArtists: TrackArtist[];
}
