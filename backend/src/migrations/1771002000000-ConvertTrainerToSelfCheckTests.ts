import { MigrationInterface, QueryRunner } from 'typeorm';

export class ConvertTrainerToSelfCheckTests1771002000000 implements MigrationInterface {
  name = 'ConvertTrainerToSelfCheckTests1771002000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "course_topic"
      SET "trainer" = jsonb_build_object(
        'title', COALESCE("trainer"->>'title', CONCAT('Тест по теме: ', "title")),
        'description', COALESCE("trainer"->>'description', 'Проверь понимание материала темы.'),
        'questions', jsonb_build_array(
          jsonb_build_object(
            'question', CONCAT('Что относится к теме "', "title", '"?'),
            'options', jsonb_build_array('Ключевые принципы темы', 'Случайное действие', 'Игнорирование требований'),
            'correctIndex', 0
          ),
          jsonb_build_object(
            'question', 'Какой подход к проверке наиболее корректен?',
            'options', jsonb_build_array('Проверить позитивные и негативные сценарии', 'Проверить только happy path', 'Не фиксировать результат'),
            'correctIndex', 0
          )
        )
      )
      WHERE "trainer" IS NOT NULL
        AND (
          NOT ("trainer" ? 'questions')
          OR jsonb_typeof("trainer"->'questions') <> 'array'
          OR jsonb_array_length("trainer"->'questions') = 0
        )
    `);

    await queryRunner.query(`
      UPDATE "course_topic"
      SET "trainer" = jsonb_build_object(
        'title', CONCAT('Тест по теме: ', "title"),
        'description', 'Проверь понимание материала темы.',
        'questions', jsonb_build_array(
          jsonb_build_object(
            'question', CONCAT('Что относится к теме "', "title", '"?'),
            'options', jsonb_build_array('Ключевые принципы темы', 'Случайное действие', 'Игнорирование требований'),
            'correctIndex', 0
          ),
          jsonb_build_object(
            'question', 'Какой подход к проверке наиболее корректен?',
            'options', jsonb_build_array('Проверить позитивные и негативные сценарии', 'Проверить только happy path', 'Не фиксировать результат'),
            'correctIndex', 0
          )
        )
      )
      WHERE "trainer" IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "course_topic"
      SET "trainer" = jsonb_build_object(
        'type', 'case-builder',
        'title', COALESCE("trainer"->>'title', CONCAT('Тренажер: ', "title")),
        'description', COALESCE("trainer"->>'description', 'Выполни практическое задание по теме.')
      )
      WHERE "trainer" IS NOT NULL
        AND "trainer" ? 'questions'
    `);
  }
}
