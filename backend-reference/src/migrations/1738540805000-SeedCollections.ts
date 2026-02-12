import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Раньше здесь был сид коллекций. Данные теперь создаются скриптом scripts/seed-data.js.
 */
export class SeedCollections1738540805000 implements MigrationInterface {
  name = 'SeedCollections1738540805000';

  public async up(_queryRunner: QueryRunner): Promise<void> {
    // no-op: seed перенесён в scripts/seed-data.js
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // no-op
  }
}
