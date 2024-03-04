import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import { productRouter } from './domain/product/product.routes';
import { authRouter } from './domain/auth/auth.routes';
import AppDataSource from './typeOrm.config';
import passport from 'passport';
import { uploadRouter } from './domain/upload/upload.routes';
import cors from 'cors';

export const runApp = async () => {
  const app = express();

  const dbConnection = await AppDataSource.initialize();

  app.use(cors());
  app.use(bodyParser.json());

  app.use(passport.initialize());

  app.use('/upload', uploadRouter);
  app.use('/auth', authRouter);
  app.use('/products', productRouter);

  return {
    app,
    dbConnection,
  };
};
