export type ProductDBType = {
  id: number;
  name: string;
  price: number;
};

export type DBType = {
  products: {
    id: number;
    name: string;
    price: number;
  }[];
};
