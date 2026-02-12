import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Раньше здесь были сиды категорий и товаров. Данные теперь создаются скриптом scripts/seed-data.js.
 */
export class SeedCategoriesAndProducts1738540804000 implements MigrationInterface {
  name = 'SeedCategoriesAndProducts1738540804000';

  public async up(_queryRunner: QueryRunner): Promise<void> {
    // no-op: seed перенесён в scripts/seed-data.js
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // no-op
  }
}
