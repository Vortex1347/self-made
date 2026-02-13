# QA Academy — проверка проекта (аудит)

Дата: 2026-02-13.

---

## 1. Сводка

Проект соответствует целевому MVP:
- API связан с frontend;
- роли admin/student разделены;
- маршруты подключены;
- миграции покрывают доменную схему;
- комментарии и доступ по подписке работают по backend-правилам.

---

## 2. Фактическое состояние

### 2.1 Backend

- В `app.module.ts` подключены все нужные controller modules:
  - `AuthControllerModule`
  - `HealthControllerModule`
  - `StudentAuthControllerModule`
  - `CourseControllerModule`
  - `TopicCommentControllerModule`
  - `AdminStudentControllerModule`
  - `AdminCommentControllerModule`

- Auth:
  - admin login: `POST /api/v1/auth/login`
  - student login: `POST /api/public/student-auth/login`

- Доступ студента по дате:
  - `requireAccess()` блокирует истёкшую подписку на protected student endpoints.

### 2.2 Database

- Миграции создают:
  - `user_account`
  - `student_account`
  - `course_module`
  - `course_topic`
  - `topic_comment`

- Тестовые пользователи **не** в миграции.
- Для тестов используется отдельный сид:
  - `npm run db:seed:test-users`
  - создаёт/обновляет `supervisor/supervisor` и `user/user`.

### 2.3 Frontend

- Страницы:
  - `/` (landing)
  - `/crm` (admin)
  - `/student` (student)

- API-слой (`frontend/app-data.js`) реализует:
  - admin login + JWT
  - student login + JWT
  - запросы к студентам, курсу, комментариям
  - загрузку и отправку trainer (`getTrainer`, `submitTrainer`)

- PATCH/DELETE комментариев использует корректный URL:
  - `/api/public/topics/:topicId/comments/:id`
- Student UI теперь использует trainer API вместо статической заглушки.

---

## 3. Запуск (актуальный)

1. Backend:
- `cd backend`
- `npm install`
- `npm run db:docker:up:mac` (или `db:docker:up:win`)
- `npm run migration:run`
- `npm run db:seed:test-users`
- `npm run start:dev`

2. Frontend:
- поднять static server в `frontend/`
- открыть `/`, `/crm`, `/student`

3. Порт БД по умолчанию:
- `5435`

---

## 4. Риски и улучшения

### 4.1 Не блокирует релиз MVP

1. CRM UX:
- ✅ Добавлен режим редактирования ученика с автозаполнением формы и отменой.

2. Frontend 404:
- ✅ Добавлена `frontend/404.html`.

3. Тренажёры:
- ✅ Определён и реализован MVP контракт:
  - `GET /api/public/course/topics/:id/trainer`
  - `POST /api/public/course/topics/:id/trainer/submit`

### 4.2 Операционные практики

- Для production задавать явный `API_CORS_ORIGINS`.
- Не использовать `API_JWT_ACCESS_TOKEN_SECRET=change-me` в production.

---

## 5. Итог

Основные расхождения между концептом и реализацией закрыты.
Текущий статус: **MVP рабочий**, включая CRM edit UX, 404 fallback и trainer API contract.
