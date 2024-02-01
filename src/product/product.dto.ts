export type ProductParamsType = {
  productId: string;
};

export type ProductQueryType = {
  name?: string;
};

export type ProductInDto = {
  name: string;
  price?: number;
};

export type ProductOutDto = {
  id: number;
  name: string;
};
