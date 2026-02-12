-- Права на схему public для пользователя postgres (подключиться к БД elite_schmuck).
-- Запуск: psql -h localhost -p 5433 -U postgres -d elite_schmuck -f scripts/grants.sql
-- Или через Docker: docker exec -i elite-schmuck-db psql -U postgres -d elite_schmuck < scripts/grants.sql

GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres;
