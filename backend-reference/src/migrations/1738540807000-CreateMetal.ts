import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMetal1738540807000 implements MigrationInterface {
  name = 'CreateMetal1738540807000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "metal" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "sort_order" integer NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_metal_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      INSERT INTO "metal" ("id", "name", "sort_order", "created_at")
      SELECT uuid_generate_v4(), n, o, now()
      FROM (VALUES ('Silber', 10), ('Gold', 20), ('Weißgold', 30), ('Gelbgold', 40)) AS t(n, o)
      WHERE NOT EXISTS (SELECT 1 FROM "metal" LIMIT 1)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS "metal"');
  }
}
