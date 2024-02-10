import { UserDBType } from '../db.types';
import { mapObject } from '../utils';
import { UserOutDto } from './user.dto';

const fieldsForMap: (keyof UserOutDto)[] = ['id', 'email', 'createdAt', 'updatedAt'];

export const userDBMapper = (dbProduct: UserDBType): UserOutDto => mapObject(dbProduct, fieldsForMap);

export const usersDBMapper = (dbProducts: UserDBType[]): UserOutDto[] => {
  return dbProducts.map((p) => mapObject(p, fieldsForMap));
};
