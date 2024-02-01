// import request from 'supertest';
// import { app } from '../../src/app';
// import { HTTP_STATUSES } from '../../src/constants';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// beforeAll(async () => {
//   // Створення тестової бази даних за допомогою команди createdb (використовуйте відповідний механізм для вашої бази даних)
//   await prisma.$executeRaw(`createdb ${process.env.TEST_DB_NAME}` as any);

//   // Змінення параметрів підключення до тестової бази
//   process.env.DATABASE_URL = `postgresql://username:password@localhost:5432/${process.env.TEST_DB_NAME}`;
// });

// describe('/product', () => {
//   beforeAll(async () => {
//     await request(app).delete('/__test__/data').expect(HTTP_STATUSES.NO_CONTENT_204);
//   });
//   it('Should return HTTP_STATUSES.OK_200 and empty array', async () => {
//     await request(app).get('/products').expect(HTTP_STATUSES.OK_200, []);
//   });
//   it('Should return HTTP_STATUSES.NOT_FOUND_404 for not existing product', async () => {
//     await request(app).get('/products/1').expect(HTTP_STATUSES.NOT_FOUND_404, 'Not Found');
//   });
// });
