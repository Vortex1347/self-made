import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductIsArchived1738540808000 implements MigrationInterface {
  name = 'AddProductIsArchived1738540808000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "product"
      ADD COLUMN IF NOT EXISTS "is_archived" boolean NOT NULL DEFAULT false
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "is_archived"`);
  }
}
