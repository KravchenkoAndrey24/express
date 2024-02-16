import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import { productRouter } from './domain/product/product.routes';
import { authRouter } from './domain/auth/auth.routes';
import AppDataSource from './typeOrm.config';
import passport from 'passport';

export const runApp = async () => {
  const app = express();

  const dbConnection = await AppDataSource.initialize();

  app.use(bodyParser.json());

  app.use(passport.initialize());

  app.use('/auth', authRouter);
  app.use('/products', productRouter);

  return {
    app,
    dbConnection,
  };
};
