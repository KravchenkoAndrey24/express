import express from 'express';
import bodyParser from 'body-parser';
import { getProductsRouter } from './routes/products.routes';
import { connentToPrisma } from './prisma.client';
import { getJWTpassport } from './auth/auth.config';
import { getAuthRouter } from './routes/auth.routes';

export const runApp = async () => {
  const prisma = await connentToPrisma();
  const app = express();

  const { JWTpassport, protectedRoute } = getJWTpassport(prisma);

  app.use(bodyParser.json());
  app.use(JWTpassport.initialize());

  app.use('/auth', getAuthRouter({ prisma, protectedRoute }));
  app.use('/products', getProductsRouter({ prisma, protectedRoute }));

  return app;
};
