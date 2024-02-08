import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import { productsRouter } from './routes/products.routes';
import { JWTpassport } from './auth/auth.config';
import { authRouter } from './routes/auth.routes';
import AppDataSource from './typeOrm.config';

export const runApp = async () => {
  const app = express();

  await AppDataSource.initialize();

  app.use(bodyParser.json());
  app.use(JWTpassport.initialize());

  app.use('/auth', authRouter);
  app.use('/products', productsRouter);

  return app;
};
