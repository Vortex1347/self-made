# QA Academy

## Project layout
- `frontend/` - landing page, admin CRM page, student portal page
- `backend/` - NestJS API (students, course topics, comments, auth)
- `backend-reference/` - old reference skeleton (kept as archive)

## Current status
- Frontend is connected to backend API.
- Admin can log in, create/update/delete students, and moderate comments.
- Student can log in, open modules/topics, post/edit/delete own comments.
- Access is enforced on backend by `accessUntil` date.

## Quick start
1. Backend:
   - go to `backend/`
   - copy `env.example.txt` to `.env`
   - run `npm install`
   - run `npm run db:create`
   - run `npm run migration:run`
   - run `npm run db:seed-admin`
   - run `npm run db:seed-students`
   - run `npm run start:dev`
2. Frontend:
   - serve `frontend/` with any static server
   - open `frontend/crm.html` and `frontend/student.html`

## Test credentials
- Admin (from `env.example.txt` defaults):
  - login: `admin`
  - password: `admin123`
- Students (seed script):
  - `ivan.qa / pass123` (active)
  - `maria.qa / pass123` (expired)
