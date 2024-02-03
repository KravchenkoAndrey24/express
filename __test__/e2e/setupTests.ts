import { Express } from 'express';
import { runApp } from '../../src/app';
import { Server } from 'http';

export let testApp: Express;
let testServer: Server;

const port = process.env.TEST_PORT || 3001;

global.beforeAll(async () => {
  const app = await runApp();
  testApp = app;
  testServer = app.listen(port);
});

global.afterAll(async () => {
  testServer.close();
});
