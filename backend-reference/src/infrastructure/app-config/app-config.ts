export const appConfig = {
  apiPort: parseInt(process.env.API_PORT || '4000', 10),
  jwtSecret: process.env.API_JWT_ACCESS_TOKEN_SECRET || '',
  jwtExpiration: process.env.API_JWT_ACCESS_TOKEN_EXPIRATION || '8h',
  corsOrigins: (process.env.API_CORS_ORIGINS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean),
  db: {
    host: process.env.API_DB_HOST || 'localhost',
    port: parseInt(process.env.API_DB_PORT || '5433', 10),
    database: process.env.API_DB_DATABASE || 'elite_schmuck',
    username: process.env.API_DB_USERNAME || 'postgres',
    password: process.env.API_DB_PASSWORD || 'postgres',
  },
  smtp: {
    host: process.env.API_SMTP_HOST,
    port: parseInt(process.env.API_SMTP_PORT || '465', 10),
    user: process.env.API_SMTP_USER_NAME,
    password: process.env.API_SMTP_PASSWORD,
    from: process.env.API_SMTP_SENDER_EMAIL,
  },
};
