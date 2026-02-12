import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1738540799000 implements MigrationInterface {
  name = 'InitialSchema1738540799000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.query(`
      CREATE TABLE "admin" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "login" character varying NOT NULL,
        "password_hash" character varying NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_admin_login" UNIQUE ("login"),
        CONSTRAINT "PK_admin_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "category" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "slug" character varying NOT NULL,
        "sort_order" integer NOT NULL DEFAULT 0,
        "is_visible" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_category_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_category_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "collection" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "slug" character varying NOT NULL,
        "description" text,
        "sort_order" integer NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_collection_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_collection_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "product" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "slug" character varying NOT NULL,
        "category_id" uuid NOT NULL,
        "collection_id" uuid,
        "price_type" character varying NOT NULL DEFAULT 'on_request',
        "price" numeric(12,2),
        "currency" character varying NOT NULL DEFAULT 'EUR',
        "description_short" text,
        "characteristics" jsonb,
        "is_new" boolean NOT NULL DEFAULT false,
        "is_limited" boolean NOT NULL DEFAULT false,
        "is_active" boolean NOT NULL DEFAULT true,
        "sort_order" integer NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_product_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_product_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_product_category" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_product_collection" FOREIGN KEY ("collection_id") REFERENCES "collection"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "product_image" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "product_id" uuid NOT NULL,
        "file_path" character varying NOT NULL,
        "sort_order" integer NOT NULL DEFAULT 0,
        CONSTRAINT "PK_product_image_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_product_image_product" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "page" (
        "slug" character varying NOT NULL,
        "title" character varying NOT NULL,
        "content" text NOT NULL,
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_page_slug" PRIMARY KEY ("slug")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "setting" (
        "key" character varying NOT NULL,
        "value" text NOT NULL,
        CONSTRAINT "PK_setting_key" PRIMARY KEY ("key")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "newsletter_subscriber" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "status" character varying NOT NULL DEFAULT 'pending',
        "token" character varying,
        "token_expires_at" TIMESTAMP,
        "unsubscribe_token" character varying,
        "confirmed_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_newsletter_subscriber_email" UNIQUE ("email"),
        CONSTRAINT "UQ_newsletter_subscriber_unsubscribe_token" UNIQUE ("unsubscribe_token"),
        CONSTRAINT "PK_newsletter_subscriber_id" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS "newsletter_subscriber"');
    await queryRunner.query('DROP TABLE IF EXISTS "setting"');
    await queryRunner.query('DROP TABLE IF EXISTS "page"');
    await queryRunner.query('DROP TABLE IF EXISTS "product_image"');
    await queryRunner.query('DROP TABLE IF EXISTS "product"');
    await queryRunner.query('DROP TABLE IF EXISTS "collection"');
    await queryRunner.query('DROP TABLE IF EXISTS "category"');
    await queryRunner.query('DROP TABLE IF EXISTS "admin"');
  }
}
