import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Comment } from '../../track/entities/comment.entity';
import { AlbumTrack } from './album-track.entity';

@Entity('albums')
export class Album {
  @PrimaryColumn({ type: 'varchar', length: 24 })
  id: string;

  @Column({ type: 'varchar', default: '' })
  name: string;

  @Column({ type: 'varchar', default: '' })
  author: string;

  @Column({ type: 'varchar', default: '' })
  picture: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @OneToMany(() => AlbumTrack, (albumTrack) => albumTrack.album)
  albumTracks: AlbumTrack[];

  @OneToMany(() => Comment, (comment) => comment.album)
  comments: Comment[];
}
