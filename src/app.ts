import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import { productRouter } from './domain/product/product.routes';
import { JWTpassport } from './domain/auth/auth.config';
import { authRouter } from './domain/auth/auth.routes';
import AppDataSource from './typeOrm.config';

export const runApp = async () => {
  const app = express();

  const dbConnection = await AppDataSource.initialize();

  app.use(bodyParser.json());
  app.use(JWTpassport.initialize());

  app.use('/auth', authRouter);
  app.use('/products', productRouter);

  return {
    app,
    dbConnection,
  };
};
