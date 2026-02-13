# QA Academy — концепт и статус

**Текущий статус (2026-02-13):**
- backend и frontend связаны через API;
- clean routes во фронте: `/`, `/crm`, `/student`;
- DB поднимается через Docker-скрипты;
- тестовые пользователи добавляются отдельным скриптом `db:seed:test-users`.

Подробная проверка и дорожная карта улучшений: [PROJECT_AUDIT.md](./PROJECT_AUDIT.md).

---

## 1. Концепт (сжатый)

MVP платформы обучения QA:
- роли: админ (CRM) и ученик (портал);
- доступ ученика ограничен `accessUntil`;
- курс: модули → темы, контент-блоки, опциональный `trainer`;
- комментарии по темам: ученик управляет своими, админ модерирует все;
- backend на NestJS + PostgreSQL + TypeORM migrations;
- frontend как статические страницы с API-интеграцией.

---

## 2. Актуальное состояние

### 2.1 Backend маршруты
- Все нужные controller-модули подключены в `backend/src/app.module.ts`.
- Публичные и админские маршруты зарегистрированы и защищены соответствующими guard-ами.

### 2.2 БД и миграции
- Схема покрыта миграциями:
  - `user_account`
  - `student_account`
  - `course_module`
  - `course_topic`
  - `topic_comment`
- Доменные сиды модулей/тем в миграции присутствуют.
- Тестовые пользователи вынесены из миграции в отдельный сид-скрипт.

### 2.3 Сущности и DbModule
- В `DbModule` инжектится `UserEntity`.
- Остальные сущности подключаются в feature-модулях через `forFeature`.
- Корневой DataSource подхватывает сущности через glob `entities/*.entity{.ts,.js}`.

### 2.4 Frontend ↔ Backend
- Фронт работает через API-слой (`frontend/app-data.js`), а не через статический COURSE_DATA.
- Админский логин и JWT в CRM реализованы.
- Студенческий логин и JWT для публичных маршрутов реализованы.
- PATCH/DELETE комментариев вызываются в формате `/api/public/topics/:topicId/comments/:id`.

---

## 3. Операционный чек-лист

1. Backend:
- `cd backend`
- `npm install`
- `npm run db:docker:up:mac` (или `db:docker:up:win`)
- `npm run migration:run`
- `npm run db:seed:test-users`
- `npm run start:dev`

2. Frontend:
- поднять static server из `frontend/`
- открыть `/`, `/crm`, `/student`

3. Тестовые креды:
- admin: `supervisor / supervisor`
- student: `user / user`

---

## 4. Последние доработки

- В CRM добавлен режим редактирования ученика с автоподстановкой данных в форму и кнопкой отмены.
- Добавлена отдельная страница `frontend/404.html` для несуществующих путей.
- Для тренажёров определён и реализован MVP API-контракт:
  - `GET /api/public/course/topics/:id/trainer`
  - `POST /api/public/course/topics/:id/trainer/submit`
