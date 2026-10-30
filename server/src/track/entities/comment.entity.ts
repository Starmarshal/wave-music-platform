import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Track } from './track.entity';
import { Album } from '../../album/entities/album.entity';

@Entity('comments')
export class Comment {
  @PrimaryColumn({ type: 'varchar', length: 24 })
  id: string;

  @Column({ type: 'varchar', default: '' })
  username: string;

  @Column({ type: 'text', default: '' })
  text: string;

  @Index('IDX_comments_track_id')
  @Column({ name: 'track_id', type: 'varchar', length: 24, nullable: true })
  trackId: string | null;

  @ManyToOne(() => Track, (track) => track.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'track_id' })
  track: Track | null;

  @Index('IDX_comments_album_id')
  @Column({ name: 'album_id', type: 'varchar', length: 24, nullable: true })
  albumId: string | null;

  @ManyToOne(() => Album, (album) => album.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'album_id' })
  album: Album | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
