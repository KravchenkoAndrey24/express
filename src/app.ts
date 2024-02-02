import express from 'express';
import bodyParser from 'body-parser';
import { getProductsRouter } from './routes/products.routes';
import { connentToPrisma } from './prisma.client';

export const runApp = async () => {
  const prisma = await connentToPrisma();
  const app = express();

  app.use(bodyParser.json());
  app.use('/products', getProductsRouter(prisma));

  return app;
};
