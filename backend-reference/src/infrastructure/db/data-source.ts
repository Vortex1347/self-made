import path from 'path';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

// Загрузить .env при запуске CLI (миграции) — Nest при старте приложения грузит сам
config({ path: path.resolve(__dirname, '../../../.env') });

/** Единый конфиг TypeORM: для CLI (миграции) и для Nest (DbModule). */
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.API_DB_HOST || 'localhost',
  port: parseInt(process.env.API_DB_PORT || '5433', 10),
  username: process.env.API_DB_USERNAME || 'postgres',
  password: process.env.API_DB_PASSWORD || 'postgres',
  database: process.env.API_DB_DATABASE || 'elite_schmuck',
  entities: [path.join(__dirname, '../../entities/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, '../../migrations/*{.ts,.js}')],
  synchronize: false,
};

export const AppDataSource = new DataSource(dataSourceOptions);
