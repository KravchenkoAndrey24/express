import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm';
import { TemporaryUserToken, Product, Session, User } from './entities';

dotenv.config();

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.HOST,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  entities: [User, Product, Session, TemporaryUserToken],
  migrations: [`${__dirname}/migrations/**/*{.ts,.js}`],
  subscribers: [`${__dirname}/'src/subscriber/**/*{.ts,.js}`],
  migrationsTableName: 'migrations',
  logging: false,
  ssl: process.env.CONNECT_SSL !== 'false',
  synchronize: false,
};

export default new DataSource(typeOrmConfig);
