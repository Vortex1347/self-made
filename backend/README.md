# QA Academy Backend

NestJS API with:
- JWT admin auth
- JWT student auth
- PostgreSQL + TypeORM migrations
- manual student access control (`accessUntil`)

## Run
1. Copy `env.example.txt` to `.env`
2. `npm install`
3. Start PostgreSQL in Docker and recreate DB:
   - macOS/Linux: `npm run db:docker:up:mac`
   - Windows (PowerShell): `npm run db:docker:up:win`
   - If `5435` is busy on macOS/Linux: `DB_HOST_PORT=5436 npm run db:docker:up:mac`
   - If `5435` is busy on Windows: `npm run db:docker:up:win -- -HostPort 5436`
   - Full reset with migrations (macOS/Linux): `npm run db:docker:reset:mac`
4. `npm run migration:run`
5. `npm run db:seed:test-users` (test-only: creates `supervisor/supervisor` and `user/user`)
6. Optional course content seed for CRM preview:
   - `npm run db:seed:course:qa-bible`
7. `npm run start:dev`

`npm run db:create` always does full reset: terminate active connections, `DROP DATABASE IF EXISTS`, `CREATE DATABASE`, and `GRANT`.
`npm run db:debug` shows active DB config and checks connectivity for admin/app users.
`npm run db:seed:test-users` upserts test users:
- Admin: `supervisor / supervisor`
- Student: `user / user` (active for 365 days from run date)
`npm run db:seed:course:qa-bible` replaces current modules/topics with a beginner-friendly QA course structure for CRM preview.

## Main endpoints
- Admin auth:
  - `POST /api/v1/auth/login`
  - `GET /api/v1/auth/me`
- Admin CRM:
  - `GET /api/v1/admin/students`
  - `POST /api/v1/admin/students`
  - `PATCH /api/v1/admin/students/:id/access`
  - `DELETE /api/v1/admin/students/:id`
  - `GET /api/v1/admin/comments`
  - `PATCH /api/v1/admin/comments/:id`
  - `DELETE /api/v1/admin/comments/:id`
  - `GET /api/v1/admin/course/modules`
  - `POST /api/v1/admin/course/modules`
  - `PATCH /api/v1/admin/course/modules/:id`
  - `DELETE /api/v1/admin/course/modules/:id`
  - `GET /api/v1/admin/course/topics`
  - `POST /api/v1/admin/course/topics`
  - `PATCH /api/v1/admin/course/topics/:id`
  - `DELETE /api/v1/admin/course/topics/:id`
- Student:
  - `POST /api/public/student-auth/login`
  - `GET /api/public/student-auth/me`
  - `PATCH /api/public/student-auth/password`
  - `GET /api/public/course/modules`
  - `GET /api/public/course/topics/:id`
  - `GET /api/public/course/topics/:id/trainer`
  - `POST /api/public/course/topics/:id/trainer/submit`
  - `GET /api/public/topics/:topicId/comments`
  - `POST /api/public/topics/:topicId/comments`
  - `PATCH /api/public/topics/:topicId/comments/:id`
  - `DELETE /api/public/topics/:topicId/comments/:id`

## Trainer API contract (MVP)
- `GET /api/public/course/topics/:id/trainer`
  - Returns trainer payload for topic (`topicId`, `topicTitle`, `moduleTitle`, `trainer`).
- `POST /api/public/course/topics/:id/trainer/submit`
  - Body: `{ "type": "case-builder|api-check|sql", "answer": any }`
  - Returns placeholder check result (`ok`, `feedback`, `checkedAt`) for interactive trainer flow.
