import { Router } from "express";
import { HTTP_STATUSES } from "../constants";
import { DBType, ProductDBType } from "../db/db.types";
import {
  TypedRequestWithQuery,
  TypedResponse,
  TypedRequestWithParams,
  TypedRequestWithBody,
  TypedRequestWithParamsAndBody,
} from "../router/types";
import {
  ProductQueryType,
  ProductOutDto,
  ProductParamsType,
  ProductInDto,
} from "../product/dto/ProductDto";
import { productMapper } from "../product/ProductMapper";
import { db } from "../db/db";

export const productsRouter = Router();

productsRouter.get(
  "/",
  (
    req: TypedRequestWithQuery<ProductQueryType>,
    res: TypedResponse<ProductOutDto[]>
  ) => {
    if (req.query?.name) {
      const searchName = req.query?.name.toString();
      const foundProducts = db.products.filter((p) =>
        p.name.includes(searchName)
      );
      return res.json(foundProducts);
    }
    res.json(db.products.map(productMapper));
  }
);

productsRouter.get(
  "/:productId(\\d+)",
  (
    req: TypedRequestWithParams<ProductParamsType>,
    res: TypedResponse<ProductOutDto>
  ) => {
    const foundProduct = db.products.find(
      (p) => p.id === Number(req.params?.productId)
    );

    if (!foundProduct) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }

    res.json(productMapper(foundProduct));
  }
);

productsRouter.post(
  "/",
  (
    req: TypedRequestWithBody<ProductInDto>,
    res: TypedResponse<ProductOutDto>
  ) => {
    if (!req.body?.name) {
      return res.status(HTTP_STATUSES.NOT_FOUND_404);
    }

    const newProduct: ProductDBType = {
      id: new Date().getTime(),
      name: req.body?.name,
      price: 0,
    };
    db.products.push(newProduct);

    return res
      .status(HTTP_STATUSES.CREATED_201)
      .json(productMapper(newProduct));
  }
);

productsRouter.delete(
  "/:productId(\\d+)",
  (req: TypedRequestWithParams<ProductParamsType>, res) => {
    db.products = db.products.filter(
      (p) => p.id !== Number(req.params.productId)
    );
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  }
);

productsRouter.put(
  "/:productId(\\d+)",
  (
    req: TypedRequestWithParamsAndBody<ProductParamsType, ProductInDto>,
    res: TypedResponse<ProductOutDto>
  ) => {
    let updatedCourse: ProductDBType | null = null;

    db.products = db.products.map((p) => {
      if (p.id === Number(req.params.productId)) {
        updatedCourse = { ...p, ...req.body, id: p.id };
        return updatedCourse;
      }
      return p;
    });

    if (!updatedCourse) {
      return res.status(HTTP_STATUSES.NOT_FOUND_404);
    }

    res.json(productMapper(updatedCourse));
  }
);
