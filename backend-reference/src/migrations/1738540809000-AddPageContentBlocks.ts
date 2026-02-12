import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPageContentBlocks1738540809000 implements MigrationInterface {
  name = 'AddPageContentBlocks1738540809000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "page"
      ADD COLUMN IF NOT EXISTS "content_blocks" jsonb
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "page" DROP COLUMN IF EXISTS "content_blocks"`);
  }
}
