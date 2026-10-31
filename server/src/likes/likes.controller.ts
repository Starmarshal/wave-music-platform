import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, In } from 'typeorm';
import { Auth, CurrentUser } from '../auth/auth.decorators';
import { User } from '../users/entities/user.entity';
import { Track } from '../track/entities/track.entity';
import { Album } from '../album/entities/album.entity';
import { Artist } from '../artists/entities/artist.entity';
import { Playlist } from '../playlists/entities/playlist.entity';
import { ALBUM_RELATIONS } from '../album/album.service';
import {
  serializeAlbum,
  serializeArtist,
  serializePlaylist,
  serializeTrack,
  TRACK_RELATIONS,
} from '../shared/serializers';

// Тип лайка в URL -> таблица и колонка
const LIKE_TYPES = {
  tracks: { table: 'track_likes', column: 'track_id', target: 'tracks' },
  albums: { table: 'album_likes', column: 'album_id', target: 'albums' },
  artists: { table: 'artist_likes', column: 'artist_id', target: 'artists' },
  playlists: {
    table: 'playlist_likes',
    column: 'playlist_id',
    target: 'playlists',
  },
} as const;

type LikeType = keyof typeof LIKE_TYPES;

@Controller('/likes')
export class LikesController {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  private config(type: string) {
    const config = LIKE_TYPES[type as LikeType];
    if (!config) throw new NotFoundException();
    return config;
  }

  private async likedIds(type: LikeType, userId: string): Promise<string[]> {
    const { table, column } = LIKE_TYPES[type];
    const rows = await this.dataSource.query(
      `SELECT ${column} AS id FROM ${table} WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId],
    );
    return rows.map((row) => row.id);
  }

  // Только id — фронт держит их в памяти, чтобы отрисовывать сердечки
  @Get('/ids')
  @Auth()
  async ids(@CurrentUser() user: User) {
    const types = Object.keys(LIKE_TYPES) as LikeType[];
    const entries = await Promise.all(
      types.map(async (type) => [type, await this.likedIds(type, user.id)]),
    );
    return Object.fromEntries(entries);
  }

  // Полные списки для страницы «Моя музыка», от последних лайков к первым
  @Get()
  @Auth()
  async library(@CurrentUser() user: User) {
    const order = <T extends { id: string }>(ids: string[], items: T[]) =>
      ids
        .map((id) => items.find((item) => item.id === id))
        .filter(Boolean) as T[];

    const [trackIds, albumIds, artistIds, playlistIds] = await Promise.all([
      this.likedIds('tracks', user.id),
      this.likedIds('albums', user.id),
      this.likedIds('artists', user.id),
      this.likedIds('playlists', user.id),
    ]);
    const manager = this.dataSource.manager;
    const [tracks, albums, artists, playlists] = await Promise.all([
      manager.find(Track, {
        where: { id: In(trackIds) },
        relations: TRACK_RELATIONS,
      }),
      manager.find(Album, {
        where: { id: In(albumIds) },
        relations: ALBUM_RELATIONS,
      }),
      manager.find(Artist, {
        where: { id: In(artistIds) },
        relations: { label: true },
      }),
      manager.find(Playlist, {
        where: { id: In(playlistIds), isPublic: true },
        relations: { owner: true, artist: true, playlistTracks: true },
      }),
    ]);
    return {
      tracks: order(trackIds, tracks).map((track) => serializeTrack(track)),
      albums: order(albumIds, albums).map(serializeAlbum),
      artists: order(artistIds, artists).map(serializeArtist),
      playlists: order(playlistIds, playlists).map((p) => serializePlaylist(p)),
    };
  }

  @Put('/:type/:id')
  @Auth()
  async like(
    @Param('type') type: string,
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    const { table, column, target } = this.config(type);
    // Лайкнуть можно только существующий объект; приватный чужой плейлист — нельзя
    const exists = await this.dataSource.query(
      target === 'playlists'
        ? `SELECT 1 FROM playlists WHERE id = $1 AND (is_public OR owner_id = $2)`
        : `SELECT 1 FROM ${target} WHERE id = $1`,
      target === 'playlists' ? [id, user.id] : [id],
    );
    if (!exists.length) throw new NotFoundException();
    await this.dataSource.query(
      `INSERT INTO ${table} (user_id, ${column}) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [user.id, id],
    );
    return { liked: true };
  }

  @Delete('/:type/:id')
  @Auth()
  async unlike(
    @Param('type') type: string,
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    const { table, column } = this.config(type);
    await this.dataSource.query(
      `DELETE FROM ${table} WHERE user_id = $1 AND ${column} = $2`,
      [user.id, id],
    );
    return { liked: false };
  }
}
