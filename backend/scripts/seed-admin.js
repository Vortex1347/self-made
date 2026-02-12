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
const login = process.env.API_ADMIN_LOGIN || 'admin';
const plainPassword = process.env.API_ADMIN_PASSWORD || 'admin123';
const role = process.env.API_ADMIN_ROLE || 'admin';

async function main() {
  const client = new Client({ host, port, user, password, database });
  try {
    await client.connect();
    const passwordHash = await bcrypt.hash(plainPassword, 10);

    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_account (
        id uuid NOT NULL DEFAULT uuid_generate_v4(),
        login varchar NOT NULL UNIQUE,
        password_hash varchar NOT NULL,
        role varchar NOT NULL DEFAULT 'admin',
        is_active boolean NOT NULL DEFAULT true,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY (id)
      )
    `);

    const exists = await client.query('SELECT id FROM user_account WHERE login = $1 LIMIT 1', [login]);
    if (exists.rows.length > 0) {
      await client.query(
        'UPDATE user_account SET password_hash = $2, role = $3, is_active = true, updated_at = now() WHERE login = $1',
        [login, passwordHash, role],
      );
      console.log('Admin user updated:', login);
      return;
    }

    await client.query(
      'INSERT INTO user_account (login, password_hash, role) VALUES ($1, $2, $3)',
      [login, passwordHash, role],
    );
    console.log('Admin user created:', login);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
