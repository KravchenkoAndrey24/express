import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

interface CustomNodeJsGlobal {
  prisma: PrismaClient;
}

declare const global: CustomNodeJsGlobal;

const isTestEnvironment = process.env.NODE_ENV === 'test';
const testDatasourceUrl = dotenv.config()?.parsed?.TEST_DATABASE_URL;
const datasourceUrl = dotenv.config()?.parsed?.DATABASE_URL;

const currentDatasourceUrl = isTestEnvironment && datasourceUrl ? testDatasourceUrl : datasourceUrl;

const prisma = global.prisma || new PrismaClient({ datasourceUrl: currentDatasourceUrl });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
