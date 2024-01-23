import { mapObject } from "../utilts";
import { ProductDBType, ProductOutDto } from "./dto/ProductDto";

export const productMapper = (dbProduct: ProductDBType): ProductOutDto =>
  mapObject(dbProduct, ["id", "name"]);
