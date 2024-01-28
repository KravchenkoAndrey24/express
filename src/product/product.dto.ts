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
