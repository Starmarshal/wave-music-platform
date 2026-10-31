import { MigrationInterface, QueryRunner } from 'typeorm';

export class Catalog1761900000001 implements MigrationInterface {
  name = 'Catalog1761900000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Лейбл принадлежит одному пользователю с ролью label
    await queryRunner.query(`
      CREATE TABLE "labels" (
        "id" varchar(24) PRIMARY KEY,
        "name" varchar(128) NOT NULL,
        "description" text NOT NULL DEFAULT '',
        "logo" varchar NOT NULL DEFAULT '',
        "owner_id" varchar(24) UNIQUE REFERENCES "users"("id") ON DELETE SET NULL,
        "created_at" timestamptz NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "artists" (
        "id" varchar(24) PRIMARY KEY,
        "name" varchar(128) NOT NULL,
        "slug" varchar(160) NOT NULL UNIQUE,
        "bio" text NOT NULL DEFAULT '',
        "photo" varchar NOT NULL DEFAULT '',
        "label_id" varchar(24) REFERENCES "labels"("id") ON DELETE SET NULL,
        "created_at" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_artists_label_id" ON "artists" ("label_id")`,
    );

    await queryRunner.query(`
      CREATE TABLE "track_artists" (
        "track_id" varchar(24) NOT NULL REFERENCES "tracks"("id") ON DELETE CASCADE,
        "artist_id" varchar(24) NOT NULL REFERENCES "artists"("id") ON DELETE CASCADE,
        "position" integer NOT NULL DEFAULT 0,
        PRIMARY KEY ("track_id", "artist_id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_track_artists_artist_id" ON "track_artists" ("artist_id")`,
    );

    await queryRunner.query(`
      CREATE TABLE "album_artists" (
        "album_id" varchar(24) NOT NULL REFERENCES "albums"("id") ON DELETE CASCADE,
        "artist_id" varchar(24) NOT NULL REFERENCES "artists"("id") ON DELETE CASCADE,
        "position" integer NOT NULL DEFAULT 0,
        PRIMARY KEY ("album_id", "artist_id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_album_artists_artist_id" ON "album_artists" ("artist_id")`,
    );

    // Плейлист: личный (artist_id пустой) или официальный плейлист артиста
    await queryRunner.query(`
      CREATE TABLE "playlists" (
        "id" varchar(24) PRIMARY KEY,
        "owner_id" varchar(24) NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "artist_id" varchar(24) REFERENCES "artists"("id") ON DELETE CASCADE,
        "name" varchar(128) NOT NULL,
        "description" text NOT NULL DEFAULT '',
        "cover" varchar NOT NULL DEFAULT '',
        "is_public" boolean NOT NULL DEFAULT false,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_playlists_owner_id" ON "playlists" ("owner_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_playlists_artist_id" ON "playlists" ("artist_id")`,
    );

    await queryRunner.query(`
      CREATE TABLE "playlist_tracks" (
        "playlist_id" varchar(24) NOT NULL REFERENCES "playlists"("id") ON DELETE CASCADE,
        "track_id" varchar(24) NOT NULL REFERENCES "tracks"("id") ON DELETE CASCADE,
        "position" integer NOT NULL,
        "added_at" timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY ("playlist_id", "track_id")
      )
    `);

    // Лайки: одна таблица на тип, чтобы работали внешние ключи
    for (const [table, column, target] of [
      ['track_likes', 'track_id', 'tracks'],
      ['album_likes', 'album_id', 'albums'],
      ['artist_likes', 'artist_id', 'artists'],
      ['playlist_likes', 'playlist_id', 'playlists'],
    ]) {
      await queryRunner.query(`
        CREATE TABLE "${table}" (
          "user_id" varchar(24) NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
          "${column}" varchar(24) NOT NULL REFERENCES "${target}"("id") ON DELETE CASCADE,
          "created_at" timestamptz NOT NULL DEFAULT now(),
          PRIMARY KEY ("user_id", "${column}")
        )
      `);
      await queryRunner.query(
        `CREATE INDEX "IDX_${table}_${column}" ON "${table}" ("${column}")`,
      );
    }

    // Каждое засчитанное прослушивание — для статистики за период
    await queryRunner.query(`
      CREATE TABLE "listens" (
        "id" bigserial PRIMARY KEY,
        "track_id" varchar(24) NOT NULL REFERENCES "tracks"("id") ON DELETE CASCADE,
        "user_id" varchar(24) REFERENCES "users"("id") ON DELETE SET NULL,
        "listened_at" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_listens_track_time" ON "listens" ("track_id", "listened_at")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_listens_user_track_time" ON "listens" ("user_id", "track_id", "listened_at")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_listens_time" ON "listens" ("listened_at")`,
    );

    await queryRunner.query(`
      CREATE TABLE "audit_log" (
        "id" bigserial PRIMARY KEY,
        "user_id" varchar(24) REFERENCES "users"("id") ON DELETE SET NULL,
        "action" varchar(64) NOT NULL,
        "entity_type" varchar(32) NOT NULL,
        "entity_id" varchar(24),
        "details" jsonb NOT NULL DEFAULT '{}',
        "created_at" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_audit_log_created_at" ON "audit_log" ("created_at")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const table of [
      'audit_log',
      'listens',
      'playlist_likes',
      'artist_likes',
      'album_likes',
      'track_likes',
      'playlist_tracks',
      'playlists',
      'album_artists',
      'track_artists',
      'artists',
      'labels',
    ]) {
      await queryRunner.query(`DROP TABLE "${table}"`);
    }
  }
}
