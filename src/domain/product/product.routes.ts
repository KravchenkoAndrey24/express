import { Router } from 'express';
import { HTTP_STATUSES } from '../../constants';
import {
  TypedRequestWithQuery,
  TypedResponse,
  TypedRequestWithParams,
  TypedRequestWithBody,
  TypedRequestWithParamsAndBody,
} from '../../router/types';
import { ProductQueryType, ProductOutDto, ProductParamsType, ProductInDto } from './product.dto';
import { productMapper, productsMapper } from './product.mappers';
import { getValidateSchema } from '../../schema-validator/schemas.utils';
import { productRepository } from './product.repository';
import { protectedRoute } from '../auth/auth.config';
import { getValidAPIError } from '../../errors.utils';

export const productRouter = Router().use(protectedRoute);

productRouter.get('/', async (req: TypedRequestWithQuery<ProductQueryType>, res: TypedResponse<ProductOutDto[]>) => {
  try {
    const foundProducts = await productRepository.findProducts(req.query?.name);
    res.json(productsMapper(foundProducts));
  } catch {
    res.status(HTTP_STATUSES.SERVER_ERROR_500).json(getValidAPIError({ message: 'Internal Server Error' }));
  }
});

productRouter.get(
  '/:productId(\\d+)',
  async (req: TypedRequestWithParams<ProductParamsType>, res: TypedResponse<ProductOutDto>) => {
    try {
      const foundProduct = await productRepository.findProductById(Number(req.params.productId));
      if (!foundProduct) {
        return res
          .status(HTTP_STATUSES.NOT_FOUND_404)
          .json(getValidAPIError({ field: 'product', message: 'Product not found' }));
      }

      res.json(productMapper(foundProduct));
    } catch {
      res.status(HTTP_STATUSES.SERVER_ERROR_500).json(getValidAPIError({ message: 'Internal Server Error' }));
    }
  },
);

productRouter.post(
  '/',
  getValidateSchema('products'),
  async (req: TypedRequestWithBody<ProductInDto>, res: TypedResponse<ProductOutDto>) => {
    try {
      const newProduct = await productRepository.createProduct(req.body);
      res.status(HTTP_STATUSES.CREATED_201).json(productMapper(newProduct));
    } catch {
      res.status(HTTP_STATUSES.SERVER_ERROR_500).json(getValidAPIError({ message: 'Internal Server Error' }));
    }
  },
);

productRouter.delete('/:productId(\\d+)', async (req: TypedRequestWithParams<ProductParamsType>, res) => {
  try {
    await productRepository.deleteProductById(Number(req.params.productId));
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  } catch {
    res.status(HTTP_STATUSES.SERVER_ERROR_500).json(getValidAPIError({ message: 'Internal Server Error' }));
  }
});

productRouter.put(
  '/:productId(\\d+)',
  getValidateSchema('products'),
  async (req: TypedRequestWithParamsAndBody<ProductParamsType, ProductInDto>, res: TypedResponse<ProductOutDto>) => {
    try {
      const updateProduct = await productRepository.updateProduct(Number(req.params.productId), req.body);
      if (!updateProduct) {
        return res
          .status(HTTP_STATUSES.NOT_FOUND_404)
          .json(getValidAPIError({ field: 'product', message: 'Product not found' }));
      }

      res.status(HTTP_STATUSES.CREATED_201).json(productMapper(updateProduct));
    } catch {
      res.status(HTTP_STATUSES.SERVER_ERROR_500).json(getValidAPIError({ message: 'Internal Server Error' }));
    }
  },
);
