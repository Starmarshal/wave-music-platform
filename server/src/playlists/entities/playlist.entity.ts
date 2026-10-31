import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Artist } from '../../artists/entities/artist.entity';
import { Track } from '../../track/entities/track.entity';

@Entity('playlists')
export class Playlist {
  @PrimaryColumn({ type: 'varchar', length: 24 })
  id: string;

  @Column({ name: 'owner_id', type: 'varchar', length: 24 })
  ownerId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  // Заполнен у официальных плейлистов артиста, ими управляет его лейбл
  @Column({ name: 'artist_id', type: 'varchar', length: 24, nullable: true })
  artistId: string | null;

  @ManyToOne(() => Artist, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'artist_id' })
  artist: Artist | null;

  @Column({ type: 'varchar', length: 128 })
  name: string;

  @Column({ type: 'text', default: '' })
  description: string;

  @Column({ type: 'varchar', default: '' })
  cover: string;

  @Column({ name: 'is_public', type: 'boolean', default: false })
  isPublic: boolean;

  @OneToMany(() => PlaylistTrack, (playlistTrack) => playlistTrack.playlist)
  playlistTracks: PlaylistTrack[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}

@Entity('playlist_tracks')
export class PlaylistTrack {
  @PrimaryColumn({ name: 'playlist_id', type: 'varchar', length: 24 })
  playlistId: string;

  @PrimaryColumn({ name: 'track_id', type: 'varchar', length: 24 })
  trackId: string;

  @Column({ type: 'integer' })
  position: number;

  @CreateDateColumn({ name: 'added_at', type: 'timestamptz' })
  addedAt: Date;

  @ManyToOne(() => Playlist, (playlist) => playlist.playlistTracks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'playlist_id' })
  playlist: Playlist;

  @ManyToOne(() => Track, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'track_id' })
  track: Track;
}
