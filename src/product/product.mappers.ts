import { ProductDBType } from '../db.types';
import { mapObject } from '../utils';
import { ProductOutDto } from './product.dto';

const fieldsForMap: (keyof ProductOutDto)[] = ['id', 'name', 'totalPrice'];

export const productMapper = (dbProduct: ProductDBType): ProductOutDto => mapObject(dbProduct, fieldsForMap);

export const productsMapper = (dbProducts: ProductDBType[]): ProductOutDto[] => {
  return dbProducts.map((p) => mapObject(p, fieldsForMap));
};
