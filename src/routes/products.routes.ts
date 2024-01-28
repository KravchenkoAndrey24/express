import { Router } from "express";
import { HTTP_STATUSES } from "../constants";
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
} from "../product/product.dto";
import { productMapper, productsMapper } from "../product/product.mappers";
import { productsRepository } from "../repositories/product.repository";
import { getValidateSchema } from "../schema-validator/schemas.utils";

export const productsRouter = Router();

productsRouter.get(
  "/",
  (
    req: TypedRequestWithQuery<ProductQueryType>,
    res: TypedResponse<ProductOutDto[]>
  ) => {
    const foundProducts = productsRepository.findProducts(req.query?.name);
    res.json(productsMapper(foundProducts));
  }
);

productsRouter.get(
  "/:productId(\\d+)",
  (
    req: TypedRequestWithParams<ProductParamsType>,
    res: TypedResponse<ProductOutDto>
  ) => {
    const foundProduct = productsRepository.findProductById(
      Number(req.params.productId)
    );

    if (!foundProduct) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }

    res.json(productMapper(foundProduct));
  }
);

productsRouter.post(
  "/",
  getValidateSchema("/products"),
  (
    req: TypedRequestWithBody<ProductInDto>,
    res: TypedResponse<ProductOutDto>
  ) => {
    const newProduct = productsRepository.createProduct(req.body.name);
    res.status(HTTP_STATUSES.CREATED_201).json(productMapper(newProduct));
  }
);

productsRouter.delete(
  "/:productId(\\d+)",
  (req: TypedRequestWithParams<ProductParamsType>, res) => {
    productsRepository.deleteProductById(Number(req.params.productId));
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  }
);

productsRouter.put(
  "/:productId(\\d+)",
  getValidateSchema("/products"),
  (
    req: TypedRequestWithParamsAndBody<ProductParamsType, ProductInDto>,
    res: TypedResponse<ProductOutDto>
  ) => {
    const updateProduct = productsRepository.updateProduct(
      Number(req.params.productId),
      req.body
    );

    if (!updateProduct) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }

    res.status(HTTP_STATUSES.CREATED_201).json(productMapper(updateProduct));
  }
);
