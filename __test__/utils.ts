import { Response } from 'supertest';
import { ProductDBType } from '../src/db.types';
import { SignInInDto } from '../src/domain/auth/auth.dto';
import { ProductOutDto } from '../src/domain/product/product.dto';
import { productMapper, productsMapper } from '../src/domain/product/product.mappers';
import { SessionOutDto } from '../src/domain/session/session.dto';
import { TemporaryUserTokenOutDto } from '../src/domain/temporary-user-token/temporaryUserToken.dto';
import { UserOutDto } from '../src/domain/user/user.dto';

export const getTestValidErrorMessage = (res: Response) => {
  return res.body.errors[0].message;
};

export const userCredentials: SignInInDto = {
  email: 'TestEmail@gmail.com',
  password: 'TestPassword',
};

export const mockedUser: UserOutDto = {
  id: 1,
  email: 'test@gmail.com',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockedSession: SessionOutDto = {
  id: 1,
  sessionHash: 'sessionHash',
  user: mockedUser,
};

export const mockedTemporaryUserToken: TemporaryUserTokenOutDto = {
  id: 1,
  token: '1',
  user: mockedUser,
  createdAt: new Date(),
};

export const mockedDBProducts: ProductDBType[] = [
  { id: 1, name: 'Product 1', price: 1, totalPrice: 2 },
  { id: 2, name: 'Product 2', price: 4, totalPrice: 4 },
];

export const mockedOutProducts: ProductOutDto[] = productsMapper(mockedDBProducts);

export const mockedFilterdDBProducts: ProductDBType[] = [{ id: 1, name: 'Product 1', price: 1, totalPrice: 2 }];
export const mockedFilterdOutProducts: ProductOutDto[] = productsMapper(mockedFilterdDBProducts);

export const mockedDBProduct: ProductDBType = { id: 1, name: 'Product 1', price: 1, totalPrice: 2 };
export const mockedOutProduct: ProductOutDto = productMapper(mockedDBProduct);
