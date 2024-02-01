import { ProductDBType } from '../db.types';
import { prisma } from '../prisma.client';
import { ProductInDto } from '../product/product.dto';

export const productsRepository = {
  findProducts: async (term?: string): Promise<ProductDBType[]> => {
    return await prisma.product.findMany({ where: { name: { contains: term } } });
  },
  findProductById: async (id: number): Promise<ProductDBType | null> => {
    return (await prisma.product.findUnique({ where: { id } })) ?? null;
  },
  createProduct: async (name: string): Promise<ProductDBType> => {
    return prisma.product.create({ data: { name, price: 0 } });
  },
  deleteProductById: async (id: number): Promise<null> => {
    await prisma.product.delete({ where: { id } });
    return null;
  },
  updateProduct: async (id: number, product: ProductInDto): Promise<ProductDBType | null> => {
    return prisma.product.update({ where: { id }, data: { name: product.name, price: product?.price || 0 } });
  },
};
