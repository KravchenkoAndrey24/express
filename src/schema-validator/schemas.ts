import { ObjectSchema } from 'joi';
import { productSchema } from '../product/product.schema';
import { authSchema } from '../auth/auth.schema';

export const schemas = {
  '/products': productSchema,
  '/auth': authSchema,
};

export const typedSchemas: { [key: string]: ObjectSchema } = schemas;
