import { db } from "../db/db";
import { ProductDBType } from "../db/db.types";
import { ProductInDto } from "../product/dto/ProductDto";

export const productsRepository = {
  findProducts: (term?: string) => {
    if (term) {
      return db.products.filter((p) => p.name.includes(term));
    }
    return db.products;
  },
  findProductById: (id: number) => {
    return db.products.find((p) => p.id === id) || null;
  },
  createProduct: (name: string) => {
    const newProduct: ProductDBType = {
      id: new Date().getTime(),
      name,
      price: 0,
    };
    db.products.push(newProduct);
    return newProduct;
  },
  deleteProductById: (id: number) => {
    db.products = db.products.filter((p) => p.id !== id);
    return;
  },
  updateProduct: (id: number, product: ProductInDto): ProductDBType | null => {
    let updatedProduct: ProductDBType | null = null;

    db.products = db.products.map((p) => {
      if (p.id === id) {
        updatedProduct = { ...p, ...product, id };
        return updatedProduct;
      }
      return p;
    });

    return updatedProduct || null;
  },
};
