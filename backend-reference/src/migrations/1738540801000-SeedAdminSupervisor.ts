import { MigrationInterface, QueryRunner } from 'typeorm';

/** Суперадмин всегда создаётся миграцией (не в seed-data), чтобы логин был после любого сброса БД. */
export class SeedAdminSupervisor1738540801000 implements MigrationInterface {
  name = 'SeedAdminSupervisor1738540801000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await queryRunner.query(`
      INSERT INTO "admin" ("id", "login", "password_hash", "created_at", "updated_at")
      SELECT uuid_generate_v4(), 'supervisor', '$2b$10$vxxN3LpbzDkyPf8/ZZVZUOQVsAzw8BOlLmm6KXH0K.znbNkqzy8sS', now(), now()
      WHERE NOT EXISTS (SELECT 1 FROM "admin" WHERE "login" = 'supervisor')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "admin" WHERE "login" = 'supervisor'`);
  }
}
