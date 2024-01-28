import { ProductDBType } from "../db/db.types";
import { mapObject } from "../utils";
import { ProductOutDto } from "./product.dto";

export const productMapper = (dbProduct: ProductDBType): ProductOutDto =>
  mapObject(dbProduct, ["id", "name"]);

export const productsMapper = (
  dbProducts: ProductDBType[]
): ProductOutDto[] => {
  return dbProducts.map((p) => mapObject(p, ["id", "name"]));
};
