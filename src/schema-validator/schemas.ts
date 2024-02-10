import { ObjectSchema } from 'joi';
import { productSchema } from '../product/product.schema';
import { authSchema, forgotPasswordStep2Schema } from '../auth/auth.schema';

export const schemas = {
  '/products': productSchema,
  '/auth': authSchema,
  '/forgot-password-step-2': forgotPasswordStep2Schema,
};

export const typedSchemas: { [key: string]: ObjectSchema } = schemas;
