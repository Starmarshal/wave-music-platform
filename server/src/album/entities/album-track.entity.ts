import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Album } from './album.entity';
import { Track } from '../../track/entities/track.entity';

// Связь альбом-трек с сохранением порядка треков в альбоме
@Entity('album_tracks')
export class AlbumTrack {
  @PrimaryColumn({ name: 'album_id', type: 'varchar', length: 24 })
  albumId: string;

  @Index('IDX_album_tracks_track_id')
  @PrimaryColumn({ name: 'track_id', type: 'varchar', length: 24 })
  trackId: string;

  @Column({ type: 'integer' })
  position: number;

  @ManyToOne(() => Album, (album) => album.albumTracks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'album_id' })
  album: Album;

  @ManyToOne(() => Track, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'track_id' })
  track: Track;
}
