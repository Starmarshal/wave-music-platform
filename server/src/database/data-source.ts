import { DataSource, DataSourceOptions } from 'typeorm';
import { Track } from '../track/entities/track.entity';
import { Comment } from '../track/entities/comment.entity';
import { Album } from '../album/entities/album.entity';
import { AlbumTrack } from '../album/entities/album-track.entity';
import { User } from '../users/entities/user.entity';
import { Session } from '../auth/entities/session.entity';
import { UserToken } from '../auth/entities/user-token.entity';
import { BackupCode } from '../auth/entities/backup-code.entity';
import { Label } from '../labels/entities/label.entity';
import { Artist } from '../artists/entities/artist.entity';
import {
  AlbumArtist,
  TrackArtist,
} from '../artists/entities/track-artist.entity';
import { Playlist, PlaylistTrack } from '../playlists/entities/playlist.entity';
import { InitSchema1761850000000 } from './migrations/1761850000000-InitSchema';
import { Auth1761900000000 } from './migrations/1761900000000-Auth';
import { Catalog1761900000001 } from './migrations/1761900000001-Catalog';

// Общая конфигурация: используется приложением, TypeORM CLI и скриптом миграции данных
export const dataSourceOptions = (): DataSourceOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'music_user',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'music_platform',
  entities: [
    Track,
    Comment,
    Album,
    AlbumTrack,
    User,
    Session,
    UserToken,
    BackupCode,
    Label,
    Artist,
    TrackArtist,
    AlbumArtist,
    Playlist,
    PlaylistTrack,
  ],
  migrations: [
    InitSchema1761850000000,
    Auth1761900000000,
    Catalog1761900000001,
  ],
  migrationsRun: true,
  synchronize: false,
});

export default new DataSource(dataSourceOptions());
