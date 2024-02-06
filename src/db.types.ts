export type ProductDBType = {
  id: number;
  name: string;
  price: number;
  totalPrice: number;
};

export type UserDBType = {
  id: number;
  login: string;
  createdAt: Date;
  updatedAt: Date;
  password: string;
};

export type DBType = {
  products: ProductDBType[];
  users: UserDBType[];
};
