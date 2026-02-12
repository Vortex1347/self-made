"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
function validateConfig() {
    const isProd = process.env.NODE_ENV === 'production' || process.env.API_ENVIRONMENT === 'production';
    const jwtSecret = process.env.API_JWT_ACCESS_TOKEN_SECRET?.trim();
    if (!jwtSecret) {
        throw new Error('API_JWT_ACCESS_TOKEN_SECRET must be set');
    }
    if (isProd && jwtSecret === 'change-me') {
        throw new Error('API_JWT_ACCESS_TOKEN_SECRET must not be "change-me" in production');
    }
}
async function bootstrap() {
    validateConfig();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    const corsOrigins = (process.env.API_CORS_ORIGINS || '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
    if (corsOrigins.length > 0) {
        app.enableCors({ origin: corsOrigins, credentials: true });
    }
    else if (process.env.API_ENVIRONMENT === 'develop') {
        app.enableCors({ origin: true, credentials: true });
    }
    const port = parseInt(process.env.API_PORT || '4000', 10);
    const host = process.env.API_HOST || '0.0.0.0';
    await app.listen(port, host);
    console.log(`API listening on ${host}:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map