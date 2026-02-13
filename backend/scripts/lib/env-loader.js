const fs = require('fs');
const path = require('path');

function loadEnvFromProjectRoot() {
  const envPath = path.join(__dirname, '..', '..', '.env');
  if (!fs.existsSync(envPath)) {
    return;
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) {
      return;
    }

    const key = match[1];
    const value = match[2].replace(/^["']|["']$/g, '').trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}

function getDbConfig() {
  return {
    host: process.env.API_DB_HOST || 'localhost',
    port: Number.parseInt(process.env.API_DB_PORT || '5435', 10),
    adminUser: process.env.API_DB_ADMIN_USERNAME || process.env.API_DB_USERNAME || 'postgres',
    adminPassword: process.env.API_DB_ADMIN_PASSWORD || process.env.API_DB_PASSWORD || 'postgres',
    database: process.env.API_DB_DATABASE || 'app_db',
    appUser: process.env.API_DB_USERNAME || 'postgres',
    appPassword: process.env.API_DB_PASSWORD || 'postgres',
  };
}

module.exports = {
  loadEnvFromProjectRoot,
  getDbConfig,
};
