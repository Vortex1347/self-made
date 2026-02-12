"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = exports.dataSourceOptions = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = require("dotenv");
const typeorm_1 = require("typeorm");
(0, dotenv_1.config)({ path: path_1.default.resolve(__dirname, '../../../.env') });
exports.dataSourceOptions = {
    type: 'postgres',
    host: process.env.API_DB_HOST || 'localhost',
    port: parseInt(process.env.API_DB_PORT || '5433', 10),
    username: process.env.API_DB_USERNAME || 'postgres',
    password: process.env.API_DB_PASSWORD || 'postgres',
    database: process.env.API_DB_DATABASE || 'app_db',
    entities: [path_1.default.join(__dirname, '../../entities/*.entity{.ts,.js}')],
    migrations: [path_1.default.join(__dirname, '../../migrations/*{.ts,.js}')],
    synchronize: false,
};
exports.AppDataSource = new typeorm_1.DataSource(exports.dataSourceOptions);
//# sourceMappingURL=data-source.js.map