import request from 'supertest';
import { HTTP_STATUSES } from '../../src/constants';
import { runApp } from './../../src/app';
import { Express } from 'express';

let app: Express;

beforeEach(async () => {
  const server = await runApp();
  app = server;
});

describe('/product', () => {
  it('should return epmty array of products', async () => {
    const res = await request(app).get('/products');

    expect(res.statusCode).toBe(HTTP_STATUSES.OK_200);
    expect(res.body.length).toBe(0);
  });
});
