import { ProductDBType } from "../db/db.types";
import { mapObject } from "../utils";
import { ProductOutDto } from "./dto/ProductDto";

export const productMapper = (dbProduct: ProductDBType): ProductOutDto =>
  mapObject(dbProduct, ["id", "name"]);
