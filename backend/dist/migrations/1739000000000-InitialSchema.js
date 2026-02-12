"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialSchema1739000000000 = void 0;
class InitialSchema1739000000000 {
    constructor() {
        this.name = 'InitialSchema1739000000000';
    }
    async up(queryRunner) {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user_account" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "login" character varying NOT NULL,
        "password_hash" character varying NOT NULL,
        "role" character varying NOT NULL DEFAULT 'admin',
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_account_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_user_account_login" UNIQUE ("login")
      )
    `);
    }
    async down(queryRunner) {
        await queryRunner.query('DROP TABLE IF EXISTS "user_account"');
    }
}
exports.InitialSchema1739000000000 = InitialSchema1739000000000;
//# sourceMappingURL=1739000000000-InitialSchema.js.map