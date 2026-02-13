const { loadEnvFromProjectRoot, getDbConfig } = require('./lib/env-loader');
const { DatabaseAdminService } = require('./lib/db-admin');

async function main() {
  loadEnvFromProjectRoot();
  const dbConfig = getDbConfig();

  const dbAdminService = new DatabaseAdminService(dbConfig);
  try {
    await dbAdminService.recreateDatabaseWithGrants();
    console.log(`Database recreated with grants: ${dbConfig.database} -> ${dbConfig.appUser}`);
  } catch (error) {
    const msg = error.message || error.code || String(error);
    console.error(msg);
    if (process.env.DEBUG) console.error(error.stack);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err.message || err.code || err);
  process.exit(1);
});
