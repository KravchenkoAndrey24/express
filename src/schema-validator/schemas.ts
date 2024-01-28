import { ObjectSchema } from 'joi';
import { productSchema } from '../product/product.schema';

export const schemas = {
  '/products': productSchema,
};

export const typedSchemas: { [key: string]: ObjectSchema } = schemas;
