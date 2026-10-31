import { MigrationInterface, QueryRunner } from 'typeorm';

export class Auth1761900000000 implements MigrationInterface {
  name = 'Auth1761900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" varchar(24) PRIMARY KEY,
        "email" varchar(320) NOT NULL,
        "password_hash" varchar NOT NULL,
        "display_name" varchar(64) NOT NULL,
        "role" varchar(16) NOT NULL DEFAULT 'user'
          CHECK ("role" IN ('user', 'label', 'admin')),
        "email_verified_at" timestamptz,
        "totp_secret" varchar,
        "totp_enabled" boolean NOT NULL DEFAULT false,
        "banned_at" timestamptz,
        "created_at" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_users_email" ON "users" (lower("email"))`,
    );

    await queryRunner.query(`
      CREATE TABLE "sessions" (
        "id" varchar(24) PRIMARY KEY,
        "user_id" varchar(24) NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "token_hash" varchar(64) NOT NULL UNIQUE,
        "mfa_passed" boolean NOT NULL DEFAULT false,
        "user_agent" varchar(512),
        "ip" varchar(64),
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "last_used_at" timestamptz NOT NULL DEFAULT now(),
        "expires_at" timestamptz NOT NULL
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_sessions_user_id" ON "sessions" ("user_id")`,
    );

    // Одноразовые токены: подтверждение почты и сброс пароля
    await queryRunner.query(`
      CREATE TABLE "user_tokens" (
        "id" varchar(24) PRIMARY KEY,
        "user_id" varchar(24) NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "type" varchar(32) NOT NULL,
        "token_hash" varchar(64) NOT NULL UNIQUE,
        "expires_at" timestamptz NOT NULL,
        "used_at" timestamptz,
        "created_at" timestamptz NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "backup_codes" (
        "id" varchar(24) PRIMARY KEY,
        "user_id" varchar(24) NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "code_hash" varchar(64) NOT NULL,
        "used_at" timestamptz
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_backup_codes_user_id" ON "backup_codes" ("user_id")`,
    );

    // Старые комментарии остаются без пользователя (гостевые)
    await queryRunner.query(
      `ALTER TABLE "comments" ADD "user_id" varchar(24) REFERENCES "users"("id") ON DELETE SET NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "tracks" ADD "created_by" varchar(24) REFERENCES "users"("id") ON DELETE SET NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "albums" ADD "created_by" varchar(24) REFERENCES "users"("id") ON DELETE SET NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "albums" DROP COLUMN "created_by"`);
    await queryRunner.query(`ALTER TABLE "tracks" DROP COLUMN "created_by"`);
    await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "user_id"`);
    await queryRunner.query(`DROP TABLE "backup_codes"`);
    await queryRunner.query(`DROP TABLE "user_tokens"`);
    await queryRunner.query(`DROP TABLE "sessions"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
