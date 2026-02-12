const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const { Client } = require('pg');

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
const database = process.env.API_DB_DATABASE || 'app_db';

async function upsertStudent(client, { name, login, passwordRaw, accessUntil }) {
  const passwordHash = await bcrypt.hash(passwordRaw, 10);
  const exists = await client.query('SELECT id FROM student_account WHERE login = $1 LIMIT 1', [login]);

  if (exists.rows.length > 0) {
    await client.query(
      `UPDATE student_account
       SET name = $2, password_hash = $3, access_until = $4, is_active = true, updated_at = now()
       WHERE login = $1`,
      [login, name, passwordHash, accessUntil],
    );
    return;
  }

  await client.query(
    `INSERT INTO student_account (name, login, password_hash, access_until, is_active)
     VALUES ($1, $2, $3, $4, true)`,
    [name, login, passwordHash, accessUntil],
  );
}

function addDaysIso(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

async function main() {
  const client = new Client({ host, port, user, password, database });
  try {
    await client.connect();
    await upsertStudent(client, {
      name: 'Иван',
      login: 'ivan.qa',
      passwordRaw: 'pass123',
      accessUntil: addDaysIso(30),
    });
    await upsertStudent(client, {
      name: 'Мария',
      login: 'maria.qa',
      passwordRaw: 'pass123',
      accessUntil: addDaysIso(-2),
    });
    console.log('Students seeded: ivan.qa, maria.qa');
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
