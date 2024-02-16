import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import { productRouter } from './domain/product/product.routes';
import { authRouter } from './domain/auth/auth.routes';
import AppDataSource from './typeOrm.config';
import passport from 'passport';
import session from 'express-session';

export const runApp = async () => {
  const app = express();

  const dbConnection = await AppDataSource.initialize();

  app.use(bodyParser.json());

  if (process.env.NODE_ENV !== 'test') {
    app.use(session({ secret: process.env.JWT_SECRET as string, resave: true, saveUninitialized: true }));
  }

  app.use(passport.initialize());

  app.use('/auth', authRouter);
  app.use('/products', productRouter);

  return {
    app,
    dbConnection,
  };
};
