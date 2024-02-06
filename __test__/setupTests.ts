import { runApp } from '../src/app';
import { Server } from 'http';
import request from 'supertest';
import TestAgent from 'supertest/lib/agent';
import { getSignInToken, signUpUser } from './utils';

const port = process.env.TEST_PORT || 3001;

let testServer: Server;
let token = '';

export let requestTestApp: TestAgent;
export let withAuthToken = { Authorization: '' };

global.beforeAll(async () => {
  const app = await runApp();

  requestTestApp = request(app);

  await signUpUser();
  token = await getSignInToken();
  withAuthToken = { Authorization: `Bearer ${token}` };

  testServer = app.listen(port);
});

global.afterAll(async () => {
  testServer.close();
});
