import { ProductDBType } from '../db.types';
import { ProductInDto } from '../product/product.dto';
import prisma from '../prisma.client';

export const productsRepository = {
  findProducts: async (term?: string): Promise<ProductDBType[]> => {
    return prisma.product.findMany({ where: { name: { contains: term } } });
  },
  findProductById: async (id: number): Promise<ProductDBType | null> => {
    return prisma.product.findUnique({ where: { id } });
  },
  createProduct: async (data: ProductInDto): Promise<ProductDBType> => {
    return prisma.product.create({ data });
  },
  deleteProductById: async (id: number): Promise<ProductDBType> => {
    return prisma.product.delete({ where: { id } });
  },
  updateProduct: async (id: number, data: ProductInDto): Promise<ProductDBType | null> => {
    return prisma.product.update({ where: { id }, data });
  },
};
