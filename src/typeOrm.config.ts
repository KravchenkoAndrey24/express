import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm';
import { User } from './entities/User.entity';
import { Product } from './entities/Product.entity';

const isTestEnvironment = process.env.NODE_ENV === 'test';

dotenv.config({ path: isTestEnvironment ? '.env.test' : '.env' });

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.HOST,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  entities: [User, Product],
  migrations: [`${__dirname}/migrations/**/*{.ts,.js}`],
  subscribers: [`${__dirname}/'src/subscriber/**/*{.ts,.js}`],
  migrationsTableName: 'migrations',
  logging: false,
  ssl: process.env.CONNECT_SSL !== 'false',
  synchronize: false,
};

export default new DataSource(typeOrmConfig);
