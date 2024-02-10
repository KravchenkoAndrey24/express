export type ProductDBType = {
  id: number;
  name: string;
  price: number;
  totalPrice: number;
};

export type UserDBType = {
  id: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  password: string;
};

export type SessionDBType = {
  id: number;
  userId: number;
  hash: string;
};

export type DBType = {
  products: ProductDBType[];
  users: UserDBType[];
  sessions: SessionDBType[];
};
