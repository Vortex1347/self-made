"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddLearningDomain1739000001000 = void 0;
class AddLearningDomain1739000001000 {
    constructor() {
        this.name = 'AddLearningDomain1739000001000';
    }
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "student_account" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "login" character varying NOT NULL,
        "password_hash" character varying NOT NULL,
        "access_until" date NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_student_account_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_student_account_login" UNIQUE ("login")
      )
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "course_module" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "order_index" integer NOT NULL DEFAULT 0,
        "is_published" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_course_module_id" PRIMARY KEY ("id")
      )
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "course_topic" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "module_id" uuid NOT NULL,
        "title" character varying NOT NULL,
        "order_index" integer NOT NULL DEFAULT 0,
        "content_blocks" jsonb NOT NULL DEFAULT '[]'::jsonb,
        "trainer" jsonb,
        "is_published" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_course_topic_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_course_topic_module_id" FOREIGN KEY ("module_id") REFERENCES "course_module"("id") ON DELETE CASCADE
      )
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "topic_comment" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "topic_id" uuid NOT NULL,
        "student_id" uuid NOT NULL,
        "author_name" character varying NOT NULL,
        "author_login" character varying NOT NULL,
        "text" text NOT NULL,
        "edited_by_admin" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_topic_comment_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_topic_comment_topic_id" FOREIGN KEY ("topic_id") REFERENCES "course_topic"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_topic_comment_student_id" FOREIGN KEY ("student_id") REFERENCES "student_account"("id") ON DELETE CASCADE
      )
    `);
        await queryRunner.query(`
      INSERT INTO "course_module" ("id", "title", "order_index", "is_published")
      VALUES
        ('11111111-1111-1111-1111-111111111111', 'Модуль 1. База QA', 1, true),
        ('22222222-2222-2222-2222-222222222222', 'Модуль 2. API и SQL', 2, true)
      ON CONFLICT DO NOTHING
    `);
        await queryRunner.query(`
      INSERT INTO "course_topic" ("id", "module_id", "title", "order_index", "content_blocks", "trainer", "is_published")
      VALUES
      (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
        '11111111-1111-1111-1111-111111111111',
        'Что тестировать в продукте',
        1,
        '[{"type":"text","value":"В этой теме разберем уровни тестирования и зоны риска в продукте."},{"type":"list","value":["Функциональность","Интеграции","Безопасность","UX-критичные сценарии"]}]'::jsonb,
        NULL,
        true
      ),
      (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
        '11111111-1111-1111-1111-111111111111',
        'Тест-дизайн и техники',
        2,
        '[{"type":"text","value":"Классы эквивалентности, граничные значения и таблицы решений."},{"type":"image","value":"Схема техники тест-дизайна (placeholder)"}]'::jsonb,
        '{"title":"Тест по теме: Тест-дизайн и техники","description":"Проверь ключевые принципы тест-дизайна.","questions":[{"question":"Какая техника помогает проверить границы входных данных?","options":["Граничные значения","Случайный перебор","Игнорирование требований"],"correctIndex":0},{"question":"Что важно в хорошем тест-кейсе?","options":["Четкие шаги и ожидаемый результат","Только заголовок","Без ожидаемого результата"],"correctIndex":0}]}'::jsonb,
        true
      ),
      (
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
        '22222222-2222-2222-2222-222222222222',
        'Проверка API в Postman',
        1,
        '[{"type":"text","value":"Разбираем CRUD, авторизацию, статусы и негативные проверки."}]'::jsonb,
        '{"title":"Тест по теме: Проверка API в Postman","description":"Проверь базовые знания API тестирования.","questions":[{"question":"Что нужно проверять в API-ответе в первую очередь?","options":["Статус-код и контракт ответа","Только цвет кнопки","Размер шрифта"],"correctIndex":0},{"question":"Какой сценарий обязателен в минимальном наборе?","options":["Негативный сценарий с невалидными данными","Только happy path","Только скриншот запроса"],"correctIndex":0}]}'::jsonb,
        true
      ),
      (
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
        '22222222-2222-2222-2222-222222222222',
        'SQL для QA',
        2,
        '[{"type":"text","value":"SELECT, JOIN, GROUP BY для проверки данных после API операций."},{"type":"list","value":["SELECT basics","INNER JOIN","GROUP BY + COUNT"]}]'::jsonb,
        '{"title":"Тест по теме: SQL для QA","description":"Самопроверка по SQL-практике для тестировщика.","questions":[{"question":"Какой оператор используют для объединения таблиц?","options":["JOIN","MERGE FONT","PASTE"],"correctIndex":0},{"question":"Что помогает проверить агрегированные значения?","options":["GROUP BY + COUNT","Только ORDER BY","Только LIMIT"],"correctIndex":0}]}'::jsonb,
        true
      )
      ON CONFLICT DO NOTHING
    `);
    }
    async down(queryRunner) {
        await queryRunner.query('DROP TABLE IF EXISTS "topic_comment"');
        await queryRunner.query('DROP TABLE IF EXISTS "course_topic"');
        await queryRunner.query('DROP TABLE IF EXISTS "course_module"');
        await queryRunner.query('DROP TABLE IF EXISTS "student_account"');
    }
}
exports.AddLearningDomain1739000001000 = AddLearningDomain1739000001000;
//# sourceMappingURL=1739000001000-AddLearningDomain.js.map