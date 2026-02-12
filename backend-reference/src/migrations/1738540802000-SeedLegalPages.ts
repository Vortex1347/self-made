import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Раньше здесь был сид страниц Impressum/Datenschutz. Данные теперь создаются скриптом scripts/seed-data.js.
 */
export class SeedLegalPages1738540802000 implements MigrationInterface {
  name = 'SeedLegalPages1738540802000';

  public async up(_queryRunner: QueryRunner): Promise<void> {
    // no-op: seed перенесён в scripts/seed-data.js
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // no-op
  }
}
