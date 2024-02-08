import { runApp } from '../src/app';
import { Server } from 'http';
import request from 'supertest';
import TestAgent from 'supertest/lib/agent';
import { getSignInToken, signUpUser } from './utils';
import { DataSource } from 'typeorm';

const port = process.env.TEST_PORT || 3001;

let testServer: Server;
let db: DataSource;
let token = '';

export let requestTestApp: TestAgent;
export let withAuthToken = { Authorization: '' };

global.beforeAll(async () => {
  const { app, dbConnection } = await runApp();

  requestTestApp = request(app);

  await signUpUser();
  token = await getSignInToken();
  withAuthToken = { Authorization: `Bearer ${token}` };

  db = dbConnection;
  testServer = app.listen(port);
});

global.afterAll(async () => {
  db.destroy();
  testServer.close();
});
