import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCookieConsent1738540800000 implements MigrationInterface {
  name = 'CreateCookieConsent1738540800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await queryRunner.query(`
      CREATE TABLE "cookie_consent" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "consent" boolean NOT NULL,
        "categories" jsonb,
        "ip_address" character varying,
        "user_agent" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_cookie_consent_id" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "cookie_consent"');
  }
}
