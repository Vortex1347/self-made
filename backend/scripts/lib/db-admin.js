const { Client } = require('pg');

class DatabaseAdminService {
  constructor(config) {
    this.config = config;
  }

  static assertIdentifier(name, envName) {
    if (!/^[a-z0-9_]+$/.test(name)) {
      throw new Error(`Invalid ${envName}: ${name}`);
    }
  }

  createAdminClient() {
    return new Client({
      host: this.config.host,
      port: this.config.port,
      user: this.config.adminUser,
      password: this.config.adminPassword,
      database: 'postgres',
    });
  }

  async recreateDatabaseWithGrants() {
    DatabaseAdminService.assertIdentifier(this.config.database, 'API_DB_DATABASE');
    DatabaseAdminService.assertIdentifier(this.config.appUser, 'API_DB_USERNAME');

    const client = this.createAdminClient();
    try {
      await client.connect();

      await client.query(
        `
          SELECT pg_terminate_backend(pid)
          FROM pg_stat_activity
          WHERE datname = $1 AND pid <> pg_backend_pid()
        `,
        [this.config.database],
      );

      await client.query(`DROP DATABASE IF EXISTS "${this.config.database}"`);
      await this.ensureRole(client);
      await client.query(`CREATE DATABASE "${this.config.database}" OWNER "${this.config.appUser}"`);
      await client.query(`GRANT ALL PRIVILEGES ON DATABASE "${this.config.database}" TO "${this.config.appUser}"`);
    } finally {
      await client.end();
    }
  }

  async ensureRole(client) {
    if (this.config.appUser === this.config.adminUser) {
      return;
    }

    const escapedPassword = this.config.appPassword.replace(/'/g, "''");
    const roleExists = await client.query('SELECT 1 FROM pg_roles WHERE rolname = $1', [this.config.appUser]);
    if (roleExists.rows.length === 0) {
      await client.query(`CREATE ROLE "${this.config.appUser}" WITH LOGIN PASSWORD '${escapedPassword}'`);
      return;
    }

    await client.query(`ALTER ROLE "${this.config.appUser}" WITH LOGIN PASSWORD '${escapedPassword}'`);
  }
}

module.exports = {
  DatabaseAdminService,
};
