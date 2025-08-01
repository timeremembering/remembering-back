import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

const isDevOrProd: boolean =
process.env.APP_ENV === 'development' ||
process.env.APP_ENV === 'production';

const typeOrmConfig = new DataSource({
  type: 'postgres',
  entities: [__dirname + '/src/**/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  migrationsRun: false,
  synchronize: false,
  ssl: isDevOrProd,
  extra: isDevOrProd && {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  url: process.env.DATABASE_URL,
  ...(!process.env.DATABASE_URL && {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : null,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
  }),
});

export default typeOrmConfig;
