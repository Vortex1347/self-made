# QA Academy Backend

NestJS API with:
- JWT admin auth
- JWT student auth
- PostgreSQL + TypeORM migrations
- manual student access control (`accessUntil`)

## Run
1. Copy `env.example.txt` to `.env`
2. `npm install`
3. `npm run db:create`
4. `npm run migration:run`
5. `npm run db:seed-admin`
6. `npm run db:seed-students`
7. `npm run start:dev`

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
- Student:
  - `POST /api/public/student-auth/login`
  - `GET /api/public/student-auth/me`
  - `GET /api/public/course/modules`
  - `GET /api/public/course/topics/:id`
  - `GET /api/public/topics/:topicId/comments`
  - `POST /api/public/topics/:topicId/comments`
  - `PATCH /api/public/topics/:topicId/comments/:id`
  - `DELETE /api/public/topics/:topicId/comments/:id`
