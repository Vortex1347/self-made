import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCollectionIsLimited1738540803000 implements MigrationInterface {
  name = 'AddCollectionIsLimited1738540803000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "collection"
      ADD COLUMN IF NOT EXISTS "is_limited" boolean NOT NULL DEFAULT false
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "collection"
      DROP COLUMN IF EXISTS "is_limited"
    `);
  }
}
