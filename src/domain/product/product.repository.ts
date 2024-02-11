import { ProductDBType } from '../../db.types';
import { Product } from '../../entities/Product.entity';
import { ProductInDto } from './product.dto';
import AppDataSource from '../../typeOrm.config';

const productDBRepository = AppDataSource.getRepository(Product);

export const productRepository = {
  async findProducts(term?: string): Promise<ProductDBType[]> {
    return productDBRepository.find({ where: { name: term } });
  },
  async findProductById(id: number): Promise<ProductDBType | null> {
    return productDBRepository.findOne({ where: { id } });
  },
  async createProduct(data: ProductInDto): Promise<ProductDBType> {
    return productDBRepository.save(data);
  },
  async deleteProductById(id: number): Promise<void> {
    await productDBRepository.delete(id);
  },
  async updateProduct(id: number, data: ProductInDto): Promise<ProductDBType | null> {
    await productDBRepository.update(id, data);
    return productRepository.findProductById(id);
  },
};
