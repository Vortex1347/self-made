/**
 * Создаёт БД elite_schmuck в Postgres (подключение из .env).
 * Запуск из папки backend: node scripts/create-db.js
 * Требует .env или переменные API_DB_*
 */
const { Client } = require('pg');
const path = require('path');
const fs = require('fs');

// Загрузить .env из backend/
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

if (!/^[a-z0-9_]+$/.test(database)) {
  console.error('Invalid API_DB_DATABASE:', database);
  process.exit(1);
}

const client = new Client({
  host,
  port,
  user,
  password,
  database: 'postgres',
});

async function main() {
  try {
    await client.connect();
    const r = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [database]);
    if (r.rows.length > 0) {
      console.log('Database', database, 'already exists.');
      return;
    }
    await client.query(`CREATE DATABASE ${database}`);
    console.log('Database', database, 'created.');
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
