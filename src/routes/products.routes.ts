import { Router } from 'express';
import { HTTP_STATUSES } from '../constants';
import {
  TypedRequestWithQuery,
  TypedResponse,
  TypedRequestWithParams,
  TypedRequestWithBody,
  TypedRequestWithParamsAndBody,
} from '../router/types';
import { ProductQueryType, ProductOutDto, ProductParamsType, ProductInDto } from '../product/product.dto';
import { productMapper, productsMapper } from '../product/product.mappers';
import { getValidateSchema } from '../schema-validator/schemas.utils';
import { productsRepository } from '../repositories/product.repository';
import { protectedRoute } from '../auth/auth.config';
import { getValidAPIError } from '../errors.utils';

export const productsRouter = Router();

productsRouter.use(protectedRoute);

productsRouter.get('/', async (req: TypedRequestWithQuery<ProductQueryType>, res: TypedResponse<ProductOutDto[]>) => {
  const foundProducts = await productsRepository.findProducts(req.query?.name);
  res.json(productsMapper(foundProducts));
});

productsRouter.get(
  '/:productId(\\d+)',
  async (req: TypedRequestWithParams<ProductParamsType>, res: TypedResponse<ProductOutDto>) => {
    const foundProduct = await productsRepository.findProductById(Number(req.params.productId));

    if (!foundProduct) {
      return res
        .status(HTTP_STATUSES.NOT_FOUND_404)
        .json(getValidAPIError({ field: 'product', message: 'Product not found' }));
    }

    res.json(productMapper(foundProduct));
  },
);

productsRouter.post(
  '/',
  getValidateSchema('/products'),
  async (req: TypedRequestWithBody<ProductInDto>, res: TypedResponse<ProductOutDto>) => {
    const newProduct = await productsRepository.createProduct(req.body);
    res.status(HTTP_STATUSES.CREATED_201).json(productMapper(newProduct));
  },
);

productsRouter.delete('/:productId(\\d+)', async (req: TypedRequestWithParams<ProductParamsType>, res) => {
  await productsRepository.deleteProductById(Number(req.params.productId));
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

productsRouter.put(
  '/:productId(\\d+)',
  getValidateSchema('/products'),
  async (req: TypedRequestWithParamsAndBody<ProductParamsType, ProductInDto>, res: TypedResponse<ProductOutDto>) => {
    const updateProduct = await productsRepository.updateProduct(Number(req.params.productId), req.body);

    if (!updateProduct) {
      return res
        .status(HTTP_STATUSES.NOT_FOUND_404)
        .json(getValidAPIError({ field: 'product', message: 'Product not found' }));
    }

    res.status(HTTP_STATUSES.CREATED_201).json(productMapper(updateProduct));
  },
);
