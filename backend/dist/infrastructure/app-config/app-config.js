"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
exports.appConfig = {
    apiPort: parseInt(process.env.API_PORT || '4000', 10),
    jwtSecret: process.env.API_JWT_ACCESS_TOKEN_SECRET || '',
    jwtExpiration: process.env.API_JWT_ACCESS_TOKEN_EXPIRATION || '8h',
    corsOrigins: (process.env.API_CORS_ORIGINS || '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
    db: {
        host: process.env.API_DB_HOST || 'localhost',
        port: parseInt(process.env.API_DB_PORT || '5435', 10),
        database: process.env.API_DB_DATABASE || 'app_db',
        username: process.env.API_DB_USERNAME || 'postgres',
        password: process.env.API_DB_PASSWORD || 'postgres',
    },
};
//# sourceMappingURL=app-config.js.map