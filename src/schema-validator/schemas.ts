import { ObjectSchema } from 'joi';
import { productSchema } from '../domain/product/product.schema';
import {
  signInSchema,
  forgotPasswordStep2Schema,
  newAccessTokenSchema,
  forgotPasswordStep1Schema,
} from '../domain/auth/auth.schema';

export const schemas = {
  products: productSchema,
  'sign-in': signInSchema,
  'forgot-password-step-1': forgotPasswordStep1Schema,
  'forgot-password-step-2': forgotPasswordStep2Schema,
  'new-refresh-token': newAccessTokenSchema,
};

export const typedSchemas: { [key: string]: ObjectSchema } = schemas;
