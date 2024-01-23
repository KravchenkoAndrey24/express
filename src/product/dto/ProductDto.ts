export type ProductParamsType = {
  productId: string;
};

export type ProductQueryType = {
  name?: string;
};

export type ProductInDto = {
  name: string;
};

export type ProductOutDto = {
  id: number;
  name: string;
};

export type ProductDBType = {
  id: number;
  name: string;
  price: number;
};
