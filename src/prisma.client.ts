import { PrismaClient } from './../node_modules/@prisma/client';
import dotenv from 'dotenv';

export const connentToPrisma = async () => {
  const isTestEnvironment = process.env.NODE_ENV === 'test';
  const datasourceUrl = dotenv.config()?.parsed?.TEST_DATABASE_URL;

  if (isTestEnvironment && datasourceUrl) {
    return new PrismaClient({ datasourceUrl });
  }

  return new PrismaClient();
};
