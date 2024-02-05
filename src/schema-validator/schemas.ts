import { ObjectSchema } from 'joi';
import { productSchema } from '../product/product.schema';
import { loginSchema } from '../auth/auth.schema';

export const schemas = {
  '/products': productSchema,
  '/auth': loginSchema,
};

export const typedSchemas: { [key: string]: ObjectSchema } = schemas;
