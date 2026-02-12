/**
 * Дропает БД elite_schmuck и создаёт заново (подключение из .env).
 * Запуск из корня репо: node backend/scripts/reset-db.js
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
    await client.query(`DROP DATABASE IF EXISTS ${database}`);
    await client.query(`CREATE DATABASE ${database}`);
    console.log('Database', database, 'dropped and recreated.');
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
