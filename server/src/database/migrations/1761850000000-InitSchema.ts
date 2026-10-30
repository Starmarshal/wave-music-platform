import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1761850000000 implements MigrationInterface {
  name = 'InitSchema1761850000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "tracks" (
        "id" varchar(24) PRIMARY KEY,
        "name" varchar NOT NULL DEFAULT '',
        "artist" varchar NOT NULL DEFAULT '',
        "text" text NOT NULL DEFAULT '',
        "listens" integer NOT NULL DEFAULT 0,
        "picture" varchar NOT NULL DEFAULT '',
        "audio" varchar NOT NULL DEFAULT '',
        "created_at" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "albums" (
        "id" varchar(24) PRIMARY KEY,
        "name" varchar NOT NULL DEFAULT '',
        "author" varchar NOT NULL DEFAULT '',
        "picture" varchar NOT NULL DEFAULT '',
        "created_at" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "album_tracks" (
        "album_id" varchar(24) NOT NULL REFERENCES "albums"("id") ON DELETE CASCADE,
        "track_id" varchar(24) NOT NULL REFERENCES "tracks"("id") ON DELETE CASCADE,
        "position" integer NOT NULL,
        PRIMARY KEY ("album_id", "track_id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_album_tracks_track_id" ON "album_tracks" ("track_id")`,
    );
    await queryRunner.query(`
      CREATE TABLE "comments" (
        "id" varchar(24) PRIMARY KEY,
        "username" varchar NOT NULL DEFAULT '',
        "text" text NOT NULL DEFAULT '',
        "track_id" varchar(24) REFERENCES "tracks"("id") ON DELETE CASCADE,
        "album_id" varchar(24) REFERENCES "albums"("id") ON DELETE CASCADE,
        "created_at" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_comments_track_id" ON "comments" ("track_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_comments_album_id" ON "comments" ("album_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "comments"`);
    await queryRunner.query(`DROP TABLE "album_tracks"`);
    await queryRunner.query(`DROP TABLE "albums"`);
    await queryRunner.query(`DROP TABLE "tracks"`);
  }
}
