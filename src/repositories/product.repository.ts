import { ProductDBType } from '../db.types';
import { Product } from '../entities/Product.entity';
import { ProductInDto } from '../product/product.dto';
import AppDataSource from '../typeOrm.config';

const getProductDBRepository = () => AppDataSource.getRepository(Product);

export const productRepository = {
  findProducts: async (term?: string): Promise<ProductDBType[]> => {
    return getProductDBRepository().find({ where: { name: term } });
  },
  findProductById: async (id: number): Promise<ProductDBType | null> => {
    return getProductDBRepository().findOne({ where: { id } });
  },
  createProduct: async (data: ProductInDto): Promise<ProductDBType> => {
    return getProductDBRepository().save(data);
  },
  deleteProductById: async (id: number): Promise<void> => {
    await getProductDBRepository().delete(id);
  },
  updateProduct: async (id: number, data: ProductInDto): Promise<ProductDBType | null> => {
    await getProductDBRepository().update(id, data);
    return getProductDBRepository().findOne({ where: { id } });
  },
};
