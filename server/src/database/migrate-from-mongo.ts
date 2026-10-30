/*
 * Перенос данных из MongoDB в PostgreSQL.
 *
 *   node dist/database/migrate-from-mongo.js            — перенос в пустую базу
 *   CLEAR_EXISTING_DATA=true node dist/database/...     — очистить таблицы и перенести заново
 *
 * Источник — MONGODB_URI, приёмник — DB_* переменные (см. data-source.ts).
 * id документов MongoDB сохраняются как есть, поэтому старые ссылки /tracks/<id> продолжают работать.
 */
import * as fs from 'fs';
import { MongoClient, ObjectId } from 'mongodb';
import { DataSource, EntityManager, ObjectLiteral } from 'typeorm';
import { dataSourceOptions } from './data-source';
import { Track } from '../track/entities/track.entity';
import { Comment } from '../track/entities/comment.entity';
import { Album } from '../album/entities/album.entity';
import { AlbumTrack } from '../album/entities/album-track.entity';

interface MongoTrack {
  _id: ObjectId;
  name?: string;
  artist?: string;
  text?: string;
  listens?: number;
  picture?: string;
  audio?: string;
  comments?: ObjectId[];
}

interface MongoAlbum {
  _id: ObjectId;
  name?: string;
  author?: string;
  picture?: string;
  tracks?: ObjectId[];
  comments?: ObjectId[];
}

interface MongoComment {
  _id: ObjectId;
  username?: string;
  text?: string;
}

const CHUNK_SIZE = 500;

const insertChunked = async <T extends ObjectLiteral>(
  manager: EntityManager,
  entity: new () => T,
  rows: Partial<T>[],
) => {
  for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
    await manager.insert(entity, rows.slice(i, i + CHUNK_SIZE) as any);
  }
};

const migrate = async () => {
  if (fs.existsSync('.env')) {
    process.loadEnvFile('.env');
  }
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not set');
  }
  const clearExisting = process.env.CLEAR_EXISTING_DATA === 'true';

  const mongo = await MongoClient.connect(mongoUri);
  const pg = await new DataSource(dataSourceOptions()).initialize();

  try {
    // migrationsRun работает только в Nest, здесь схему создаём явно
    await pg.runMigrations();

    const db = mongo.db();
    const tracks = await db.collection<MongoTrack>('tracks').find().toArray();
    const albums = await db.collection<MongoAlbum>('albums').find().toArray();
    const comments = await db
      .collection<MongoComment>('comments')
      .find()
      .toArray();
    console.log(
      `MongoDB "${db.databaseName}": tracks=${tracks.length}, albums=${albums.length}, comments=${comments.length}`,
    );

    const trackIds = new Set(tracks.map((t) => t._id.toHexString()));

    // В MongoDB комментарий привязан через массив comments у трека/альбома
    const commentOwner = new Map<
      string,
      { trackId?: string; albumId?: string }
    >();
    for (const track of tracks) {
      for (const commentId of track.comments ?? []) {
        commentOwner.set(commentId.toHexString(), {
          trackId: track._id.toHexString(),
        });
      }
    }
    for (const album of albums) {
      for (const commentId of album.comments ?? []) {
        const id = commentId.toHexString();
        if (commentOwner.has(id)) {
          console.warn(
            `Comment ${id} belongs to a track and an album, keeping track`,
          );
          continue;
        }
        commentOwner.set(id, { albumId: album._id.toHexString() });
      }
    }

    const trackRows = tracks.map((t) => ({
      id: t._id.toHexString(),
      name: t.name ?? '',
      artist: t.artist ?? '',
      text: t.text ?? '',
      listens: Number(t.listens) || 0,
      picture: t.picture ?? '',
      audio: t.audio ?? '',
      createdAt: t._id.getTimestamp(),
    }));

    const albumRows = albums.map((a) => ({
      id: a._id.toHexString(),
      name: a.name ?? '',
      author: a.author ?? '',
      picture: a.picture ?? '',
      createdAt: a._id.getTimestamp(),
    }));

    let missingAlbumTracks = 0;
    const albumTrackRows: Partial<AlbumTrack>[] = [];
    for (const album of albums) {
      const seen = new Set<string>();
      for (const trackObjectId of album.tracks ?? []) {
        const trackId = trackObjectId.toHexString();
        if (!trackIds.has(trackId)) {
          missingAlbumTracks++;
          continue;
        }
        if (seen.has(trackId)) continue;
        seen.add(trackId);
        albumTrackRows.push({
          albumId: album._id.toHexString(),
          trackId,
          position: seen.size - 1,
        });
      }
    }

    let orphanComments = 0;
    const commentRows: Partial<Comment>[] = [];
    for (const c of comments) {
      const id = c._id.toHexString();
      const owner = commentOwner.get(id);
      if (!owner) {
        orphanComments++;
        continue;
      }
      commentRows.push({
        id,
        username: c.username ?? '',
        text: c.text ?? '',
        trackId: owner.trackId ?? null,
        albumId: owner.albumId ?? null,
        createdAt: c._id.getTimestamp(),
      });
    }

    await pg.transaction(async (manager) => {
      const [{ count }] = await manager.query(
        `SELECT (SELECT count(*) FROM tracks) + (SELECT count(*) FROM albums) + (SELECT count(*) FROM comments) AS count`,
      );
      if (Number(count) > 0) {
        if (!clearExisting) {
          throw new Error(
            'PostgreSQL already contains data. Re-run with CLEAR_EXISTING_DATA=true to overwrite it.',
          );
        }
        console.log('Clearing existing PostgreSQL data...');
        await manager.query(
          'TRUNCATE comments, album_tracks, albums, tracks CASCADE',
        );
      }

      await insertChunked(manager, Track, trackRows);
      await insertChunked(manager, Album, albumRows);
      await insertChunked(manager, AlbumTrack, albumTrackRows);
      await insertChunked(manager, Comment, commentRows);
    });

    const counts = await pg.query(
      `SELECT (SELECT count(*) FROM tracks) AS tracks, (SELECT count(*) FROM albums) AS albums,
              (SELECT count(*) FROM album_tracks) AS album_tracks, (SELECT count(*) FROM comments) AS comments,
              (SELECT coalesce(sum(listens), 0) FROM tracks) AS listens`,
    );
    const mongoListens = tracks.reduce(
      (sum, t) => sum + (Number(t.listens) || 0),
      0,
    );
    console.log(
      'PostgreSQL now:',
      counts[0],
      `(listens in MongoDB: ${mongoListens})`,
    );
    if (missingAlbumTracks) {
      console.warn(
        `Skipped ${missingAlbumTracks} album->track links to deleted tracks`,
      );
    }
    if (orphanComments) {
      console.warn(
        `Skipped ${orphanComments} comments not attached to any track/album`,
      );
    }
    console.log('Migration finished successfully');
  } finally {
    await mongo.close();
    await pg.destroy();
  }
};

migrate().catch((e) => {
  console.error('Migration failed:', e);
  process.exit(1);
});
