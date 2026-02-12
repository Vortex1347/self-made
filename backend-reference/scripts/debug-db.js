/**
 * Отладка подключения к БД: куда стучится бэкенд и какие базы там есть.
 * Запуск из папки backend: node scripts/debug-db.js
 */
const { Client } = require('pg');
const path = require('path');
const fs = require('fs');

const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const env = fs.readFileSync(envPath, 'utf8');
  env.split('\n').forEach((line) => {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
  });
}

const host = process.env.API_DB_HOST || 'localhost';
const port = parseInt(process.env.API_DB_PORT || '5433', 10);
const user = process.env.API_DB_USERNAME || 'postgres';
const password = process.env.API_DB_PASSWORD || 'postgres';
const database = process.env.API_DB_DATABASE || 'elite_schmuck';

console.log('--- Backend DB config (from .env / defaults) ---');
console.log('  API_DB_HOST:', host);
console.log('  API_DB_PORT:', port);
console.log('  API_DB_USERNAME:', user);
console.log('  API_DB_DATABASE:', database);
console.log('  .env exists:', fs.existsSync(envPath));
console.log('');

async function run() {
  const client = new Client({
    host,
    port,
    user,
    password,
    database: 'postgres',
    connectionTimeoutMillis: 5000,
  });

  try {
    await client.connect();
    console.log('OK: connected to Postgres (database=postgres) at', host + ':' + port);
  } catch (e) {
    console.error('FAIL: cannot connect to', host + ':' + port, '-', e.message);
    console.error('');
    console.error('Проверь:');
    console.error('  - Postgres запущен? (docker ps для контейнера elite-schmuck-db)');
    console.error('  - Порт 5433 не занят другим Postgres? (на Windows часто ставится свой сервер)');
    console.error('  - backend/.env есть и API_DB_HOST/API_DB_PORT верные?');
    process.exit(1);
  }

  try {
    const r = await client.query('SELECT datname FROM pg_database ORDER BY datname');
    console.log('Databases on this server:', r.rows.map((x) => x.datname).join(', '));
    const hasDb = r.rows.some((x) => x.datname === database);
    if (!hasDb) {
      console.log('');
      console.log('>>> Базы', database, 'нет на этом сервере. Создай: npm run db:create');
    }
  } catch (e) {
    console.error('Error listing DBs:', e.message);
  } finally {
    await client.end();
  }

  // Попытка подключиться к целевой БД
  const client2 = new Client({
    host,
    port,
    user,
    password,
    database,
    connectionTimeoutMillis: 3000,
  });
  try {
    await client2.connect();
    console.log('');
    console.log('OK: подключение к', database, 'успешно — бэкенд должен видеть эту БД.');
  } catch (e) {
    console.log('');
    console.error('FAIL: подключение к БД', database, '-', e.message);
    console.error('Выполни в backend: npm run db:create');
    process.exit(1);
  } finally {
    await client2.end();
  }
}

run();
