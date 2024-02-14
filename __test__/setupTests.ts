import { runApp } from '../src/app';
import { Server } from 'http';
import request from 'supertest';
import TestAgent from 'supertest/lib/agent';
import { DataSource } from 'typeorm';

const port = process.env.TEST_PORT || 3001;

let testServer: Server;
let db: DataSource;

export let requestTestApp: TestAgent;

global.beforeAll(async () => {
  const { app, dbConnection } = await runApp();

  requestTestApp = request(app);

  db = dbConnection;
  testServer = app.listen(port);
});

global.afterAll(async () => {
  db.destroy();
  testServer.close();
});
