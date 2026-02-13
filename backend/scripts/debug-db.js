const { Client } = require('pg');
const { loadEnvFromProjectRoot, getDbConfig } = require('./lib/env-loader');

loadEnvFromProjectRoot();
const dbConfig = getDbConfig();

console.log('--- Backend DB config (.env) ---');
console.log('  API_DB_HOST:', dbConfig.host);
console.log('  API_DB_PORT:', dbConfig.port);
console.log('  API_DB_DATABASE:', dbConfig.database);
console.log('  API_DB_USERNAME:', dbConfig.appUser);
console.log('  API_DB_ADMIN_USERNAME:', dbConfig.adminUser);
console.log('');

async function main() {
  const adminClient = new Client({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.adminUser,
    password: dbConfig.adminPassword,
    database: 'postgres',
    connectionTimeoutMillis: 5000,
  });

  try {
    await adminClient.connect();
    console.log(`OK: connected to Postgres on ${dbConfig.host}:${dbConfig.port}`);
  } catch (error) {
    console.error(`FAIL: cannot connect to ${dbConfig.host}:${dbConfig.port} - ${error.message}`);
    console.error('');
    console.error('Check:');
    console.error('  - Docker container app-db is running');
    console.error('  - API_DB_PORT in backend/.env matches mapped container port');
    process.exit(1);
  }

  try {
    const list = await adminClient.query('SELECT datname FROM pg_database ORDER BY datname');
    const dbNames = list.rows.map((row) => row.datname);
    console.log('Databases:', dbNames.join(', '));

    if (!dbNames.includes(dbConfig.database)) {
      console.log(`Database "${dbConfig.database}" is missing. Run: npm run db:create`);
    }
  } finally {
    await adminClient.end();
  }

  const appClient = new Client({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.appUser,
    password: dbConfig.appPassword,
    database: dbConfig.database,
    connectionTimeoutMillis: 5000,
  });

  try {
    await appClient.connect();
    console.log(`OK: app user can connect to "${dbConfig.database}"`);
  } catch (error) {
    console.error(`FAIL: app user connection to "${dbConfig.database}" failed - ${error.message}`);
    process.exit(1);
  } finally {
    await appClient.end();
  }
}

main();
