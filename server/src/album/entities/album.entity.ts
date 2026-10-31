import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Comment } from '../../track/entities/comment.entity';
import { AlbumTrack } from './album-track.entity';
import { AlbumArtist } from '../../artists/entities/track-artist.entity';

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

  @Column({ name: 'created_by', type: 'varchar', length: 24, nullable: true })
  createdBy: string | null;

  @OneToMany(() => Comment, (comment) => comment.album)
  comments: Comment[];

  @OneToMany(() => AlbumArtist, (albumArtist) => albumArtist.album)
  albumArtists: AlbumArtist[];
}
