import { createHash } from 'crypto';

export const sha256String = (value: string) => {
  const hash = createHash('sha256');
  hash.update(value);
  const hashedValue = hash.digest('hex');
  return hashedValue;
};
