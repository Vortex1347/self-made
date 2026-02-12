import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCategoryShowInHeader1738540806000 implements MigrationInterface {
  name = 'AddCategoryShowInHeader1738540806000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "category"
      ADD COLUMN IF NOT EXISTS "show_in_header" boolean NOT NULL DEFAULT false
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "category"
      DROP COLUMN IF EXISTS "show_in_header"
    `);
  }
}
