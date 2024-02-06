import { JoiError } from './schema-validator/schema.validator';

// Use it for all responce with errors
export const getValidAPIError = ({ field = '', message }: { field?: string; message: string }): JoiError => {
  return {
    status: 'failed',
    errors: [{ field, message }],
  };
};
