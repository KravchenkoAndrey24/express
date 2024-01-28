import { schemaValidator } from './schema.validator';
import { schemas } from './schemas';

export const getValidateSchema = (key: keyof typeof schemas) => {
  return schemaValidator(key);
};
