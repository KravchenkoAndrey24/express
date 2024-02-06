import { RequestHandler } from 'express';
import { typedSchemas } from './schemas';
import { HTTP_STATUSES } from '../constants';

interface ValidationError {
  field: string;
  message: string;
}

export interface JoiError {
  status: string;
  errors: ValidationError[];
}

const supportedMethods = ['post', 'put', 'patch', 'delete'];

const validationOptions = {
  abortEarly: false,
  allowUnknown: false,
  stripUnknown: false,
};

export const schemaValidator = (path: string, useJoiError = true): RequestHandler => {
  const schema = typedSchemas[path];

  if (!schema) {
    throw new Error(`Schema not found for path: ${path}`);
  }

  return (req, res, next) => {
    const method = req.method.toLowerCase();

    if (!supportedMethods.includes(method)) {
      return next();
    }

    const { error, value } = schema.validate(req.body, validationOptions);

    if (error) {
      const customError: JoiError = {
        status: 'failed',
        errors: [
          {
            field: '',
            message: 'Invalid request. Please review request and try again.',
          },
        ],
      };

      const joiError: JoiError = {
        status: 'failed',
        errors: error.details.map(({ message, context }) => ({
          message: message.replace(/['"]/g, ''),
          field: context?.key || '',
        })),
      };

      return res.status(HTTP_STATUSES.BAD_REQUEST_400).json(useJoiError ? joiError : customError);
    }

    // validation successful
    req.body = value;
    return next();
  };
};
