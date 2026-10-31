import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Artist } from './artist.entity';
import { Track } from '../../track/entities/track.entity';
import { Album } from '../../album/entities/album.entity';

@Entity('track_artists')
export class TrackArtist {
  @PrimaryColumn({ name: 'track_id', type: 'varchar', length: 24 })
  trackId: string;

  @PrimaryColumn({ name: 'artist_id', type: 'varchar', length: 24 })
  artistId: string;

  @Column({ type: 'integer', default: 0 })
  position: number;

  @ManyToOne(() => Track, (track) => track.trackArtists, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'track_id' })
  track: Track;

  @ManyToOne(() => Artist, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'artist_id' })
  artist: Artist;
}

@Entity('album_artists')
export class AlbumArtist {
  @PrimaryColumn({ name: 'album_id', type: 'varchar', length: 24 })
  albumId: string;

  @PrimaryColumn({ name: 'artist_id', type: 'varchar', length: 24 })
  artistId: string;

  @Column({ type: 'integer', default: 0 })
  position: number;

  @ManyToOne(() => Album, (album) => album.albumArtists, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'album_id' })
  album: Album;

  @ManyToOne(() => Artist, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'artist_id' })
  artist: Artist;
}
