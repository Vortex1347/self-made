# Backend Skeleton

Этот шаблон собран из текущего `backend` и предназначен для переноса в новый проект с тем же подходом:
- NestJS API
- TypeORM + миграции
- JWT auth/guards
- rate limit
- конфигурация через env
- скрипты для БД и сидов

## Что включено
- `src/` — весь backend-код (контроллеры, сервисы, модули, миграции, инфраструктура)
- `scripts/` — backend-скрипты (`create-db`, `seed-data`, `reset-db`, ...)
- `package.json`, `package-lock.json`
- `tsconfig.json`, `nest-cli.json`
- `env.example.txt`
- `scripts-root/` — вспомогательные root-скрипты для локальной БД

## Что специально не копировалось
- `.env`
- `node_modules/`
- `dist/`
- `uploads/`

## Как перенести в новый проект
1. Скопируй содержимое этой папки в новый репозиторий (например в папку `backend`).
2. Создай `.env` на базе `env.example.txt`.
3. Установи зависимости: `npm install`.
4. Подними БД (через свои скрипты или из `scripts-root`).
5. Прогони миграции: `npm run migration:run`.
6. Запусти backend: `npm run start:dev`.

## Что обычно меняют в новом проекте
- сущности/DTO под новую доменную модель
- контроллеры public/admin и бизнес-сервисы
- сиды и миграции под новую схему
- RBAC/permissions при необходимости
