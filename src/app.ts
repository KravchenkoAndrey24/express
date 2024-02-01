import express from 'express';
import bodyParser from 'body-parser';
import { productsRouter } from './routes/products.routes';
import { prisma } from './prisma.client';
// import { testsRouter } from './routes/__test__.routes';

export const app = express();

app.use(bodyParser.json());

app.use('/products', productsRouter);
// app.use('/__test__', testsRouter);

app.use(async (req, res, next) => {
  await prisma.$disconnect();
  next();
});
