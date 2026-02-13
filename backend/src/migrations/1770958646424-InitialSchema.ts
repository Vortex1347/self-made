import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1770958646424 implements MigrationInterface {
    name = 'InitialSchema1770958646424'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course_topic" ALTER COLUMN "content_blocks" SET DEFAULT '[]'::jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course_topic" ALTER COLUMN "content_blocks" SET DEFAULT '[]'`);
    }

}
