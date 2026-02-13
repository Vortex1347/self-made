const bcrypt = require('bcrypt');
const { Client } = require('pg');
const { loadEnvFromProjectRoot, getDbConfig } = require('./lib/env-loader');

loadEnvFromProjectRoot();

const isProduction =
  process.env.API_ENVIRONMENT === 'production' || process.env.NODE_ENV === 'production';

if (isProduction && process.env.FORCE_TEST_SEED !== 'true') {
  console.error(
    'Refusing to seed test users in production. Set FORCE_TEST_SEED=true only if this is intentional.',
  );
  process.exit(1);
}

async function main() {
  const { host, port, appUser: user, appPassword: password, database } = getDbConfig();
  const client = new Client({ host, port, user, password, database });

  try {
    await client.connect();

    const supervisorPasswordHash = await bcrypt.hash('supervisor', 10);
    const adminPasswordHash = await bcrypt.hash('admin', 10);
    const studentPasswordHash = await bcrypt.hash('user', 10);

    await client.query(
      `
        INSERT INTO "user_account" ("login", "password_hash", "role", "is_active")
        VALUES ('supervisor', $1, 'admin', true)
        ON CONFLICT ("login")
        DO UPDATE SET
          "password_hash" = EXCLUDED."password_hash",
          "role" = 'admin',
          "is_active" = true,
          "updated_at" = now()
      `,
      [supervisorPasswordHash],
    );

    await client.query(
      `
        INSERT INTO "user_account" ("login", "password_hash", "role", "is_active")
        VALUES ('admin', $1, 'admin', true)
        ON CONFLICT ("login")
        DO UPDATE SET
          "password_hash" = EXCLUDED."password_hash",
          "role" = 'admin',
          "is_active" = true,
          "updated_at" = now()
      `,
      [adminPasswordHash],
    );

    await client.query(
      `
        INSERT INTO "student_account" ("name", "login", "password_hash", "access_until", "is_active")
        VALUES ('Test User', 'user', $1, (CURRENT_DATE + INTERVAL '365 days')::date, true)
        ON CONFLICT ("login")
        DO UPDATE SET
          "name" = EXCLUDED."name",
          "password_hash" = EXCLUDED."password_hash",
          "access_until" = EXCLUDED."access_until",
          "is_active" = true,
          "updated_at" = now()
      `,
      [studentPasswordHash],
    );

    console.log('Test users upserted: supervisor/supervisor, admin/admin and user/user');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
