import { DataSource, DataSourceOptions } from 'typeorm';
import { Track } from '../track/entities/track.entity';
import { Comment } from '../track/entities/comment.entity';
import { Album } from '../album/entities/album.entity';
import { AlbumTrack } from '../album/entities/album-track.entity';
import { InitSchema1761850000000 } from './migrations/1761850000000-InitSchema';

// Общая конфигурация: используется приложением, TypeORM CLI и скриптом миграции данных
export const dataSourceOptions = (): DataSourceOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'music_user',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'music_platform',
  entities: [Track, Comment, Album, AlbumTrack],
  migrations: [InitSchema1761850000000],
  migrationsRun: true,
  synchronize: false,
});

export default new DataSource(dataSourceOptions());
