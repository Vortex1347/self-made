# QA Academy

## Project layout
- `frontend/` - landing page (`/`), admin CRM (`/crm`), student portal (`/student`)
- `backend/` - NestJS API (students, course topics, comments, auth)

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
   - run `npm run db:docker:up:mac` (macOS/Linux) or `npm run db:docker:up:win` (Windows PowerShell)
   - run `npm run migration:run`
   - run `npm run db:seed:test-users` (test accounts only)
   - run `npm run start:dev`
2. Frontend:
   - serve `frontend/` with any static server
   - open `/`, `/crm`, `/student`

## Test credentials
- After `npm run db:seed:test-users`:
  - Admin: `supervisor / supervisor`
  - Student: `user / user`
