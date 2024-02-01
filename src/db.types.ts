export type ProductDBType = {
  id: number;
  name: string;
  price: number;
  totalPrice: number;
};

export type DBType = {
  products: ProductDBType[];
};
