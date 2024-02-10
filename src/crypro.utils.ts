import { createHash, randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';

export const sha256String = (value: string) => {
  const hash = createHash('sha256');
  hash.update(value);
  const hashedValue = hash.digest('hex');
  return hashedValue;
};

export const generateRandomSHA256 = () => {
  const hash = createHash('sha256');
  hash.update(randomBytes(16));
  return hash.digest('hex');
};

export const decodeAuthHeader = (auth?: string) => {
  if (!auth) {
    return null;
  }
  try {
    return jwt.decode(auth?.slice(7) as string) as {
      sessionHash?: string;
      email?: string;
    };
  } catch {
    return null;
  }
};
