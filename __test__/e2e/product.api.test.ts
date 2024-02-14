import passport from 'passport';
import { HTTP_STATUSES } from '../../src/constants';
import { productRepository } from '../../src/domain/product/product.repository';
import { requestTestApp } from '../setupTests';
import {
  mockedFilterdDBProducts,
  mockedDBProducts,
  mockedUser,
  mockedOutProducts,
  mockedFilterdOutProducts,
  mockedDBProduct,
  mockedOutProduct,
  getTestValidErrorMessage,
} from '../utils';
import { ProductInDto } from '../../src/domain/product/product.dto';
import { ProductDBType } from '../../src/db.types';
import { productMapper } from '../../src/domain/product/product.mappers';

jest.spyOn(passport, 'authenticate').mockImplementation((strategy, options, callback) => {
  callback && callback(null, mockedUser);
});

describe('GET /products', () => {
  it('should return all products when no query parameter is provided', async () => {
    jest.spyOn(productRepository, 'findProducts').mockResolvedValueOnce(mockedDBProducts);

    const res = await requestTestApp.get('/products');

    expect(res.status).toBe(HTTP_STATUSES.OK_200);
    expect(res.body).toEqual(mockedOutProducts);
  });

  it('should return filtered products when query parameter is provided', async () => {
    jest.spyOn(productRepository, 'findProducts').mockResolvedValueOnce(mockedFilterdDBProducts);

    const res = await requestTestApp.get('/products').query({ name: 'Product 1' });

    expect(res.status).toBe(HTTP_STATUSES.OK_200);
    expect(res.body).toEqual(mockedFilterdOutProducts);
  });

  it('should return an empty array if no products are found', async () => {
    jest.spyOn(productRepository, 'findProducts').mockResolvedValueOnce([]);

    const res = await requestTestApp.get('/products');

    expect(res.status).toBe(HTTP_STATUSES.OK_200);
    expect(res.body).toEqual([]);
  });

  it('should respond with an error if an exception occurs', async () => {
    jest.spyOn(productRepository, 'findProducts').mockRejectedValueOnce(new Error('Internal Server Error'));

    const res = await requestTestApp.get('/products');

    expect(res.status).toBe(HTTP_STATUSES.SERVER_ERROR_500);
    expect(getTestValidErrorMessage(res)).toBe('Internal Server Error');
  });
});

describe('GET /products/:productId', () => {
  it('should return 404 if product is not found', async () => {
    jest.spyOn(productRepository, 'findProductById').mockResolvedValueOnce(null);

    const res = await requestTestApp.get('/products/123');

    expect(res.status).toBe(HTTP_STATUSES.NOT_FOUND_404);
    expect(getTestValidErrorMessage(res)).toBe('Product not found');
  });

  it('should return product if it is found', async () => {
    jest.spyOn(productRepository, 'findProductById').mockResolvedValueOnce(mockedDBProduct);

    const res = await requestTestApp.get('/products/123');

    expect(res.status).toBe(HTTP_STATUSES.OK_200);
    expect(res.body).toEqual(mockedOutProduct);
  });

  it('should return 500 if an error occurs during processing', async () => {
    jest.spyOn(productRepository, 'findProductById').mockRejectedValueOnce(new Error('Internal Server Error'));

    const res = await requestTestApp.get('/products/123');

    expect(res.status).toBe(HTTP_STATUSES.SERVER_ERROR_500);
    expect(getTestValidErrorMessage(res)).toBe('Internal Server Error');
  });
});

describe('POST /products', () => {
  it('should create a new product', async () => {
    const newProductData: ProductInDto = {
      name: 'New Product',
      price: 10,
      totalPrice: 20,
    };

    const mockProduct: ProductDBType = { id: 1, price: 10, name: 'New Product', totalPrice: 20 };
    jest.spyOn(productRepository, 'createProduct').mockResolvedValueOnce(mockProduct);

    const response = await requestTestApp.post('/products').send(newProductData);

    expect(response.status).toBe(HTTP_STATUSES.CREATED_201);
    expect(response.body).toEqual(productMapper(mockProduct));
  });

  it('should return 400 if request body is invalid', async () => {
    jest.spyOn(productRepository, 'createProduct').mockRejectedValueOnce(new Error('Invalid request'));

    const res = await requestTestApp.post('/products').send({ invalid: 'data' });

    expect(res.status).toBe(HTTP_STATUSES.BAD_REQUEST_400);
    expect(getTestValidErrorMessage(res)).toBe('name is required');
  });

  it('should return 500 if an error occurs during processing', async () => {
    jest.spyOn(productRepository, 'createProduct').mockRejectedValueOnce(new Error('Internal Server Error'));

    const res = await requestTestApp.post('/products').send({ name: 'New Product', price: 10 });

    expect(res.status).toBe(HTTP_STATUSES.SERVER_ERROR_500);
    expect(getTestValidErrorMessage(res)).toBe('Internal Server Error');
  });
});

describe('DELETE /products/:productId', () => {
  it('should delete the product', async () => {
    jest.spyOn(productRepository, 'deleteProductById').mockResolvedValueOnce();

    const res = await requestTestApp.delete('/products/123');

    expect(res.status).toBe(HTTP_STATUSES.NO_CONTENT_204);
    expect(res.text).toBe('');
  });

  it('should return 404 if product is not found', async () => {
    jest.spyOn(productRepository, 'deleteProductById').mockResolvedValueOnce();

    const res = await requestTestApp.delete('/products/123');

    expect(res.status).toBe(HTTP_STATUSES.NO_CONTENT_204);
    expect(res.text).toBe('');
  });

  it('should return 500 if an error occurs during processing', async () => {
    jest.spyOn(productRepository, 'deleteProductById').mockRejectedValueOnce(new Error('Internal Server Error'));

    const res = await requestTestApp.delete('/products/123');

    expect(res.status).toBe(HTTP_STATUSES.SERVER_ERROR_500);
    expect(getTestValidErrorMessage(res)).toBe('Internal Server Error');
  });
});

describe('PUT /products/:productId', () => {
  it('should update the product', async () => {
    const updatedProductData = {
      name: 'Updated Product',
      price: 20,
    };

    const mockUpdatedProduct = { id: 1, ...updatedProductData, totalPrice: 30 };
    jest.spyOn(productRepository, 'updateProduct').mockResolvedValueOnce(mockUpdatedProduct);

    const res = await requestTestApp.put('/products/123').send(updatedProductData);

    expect(res.status).toBe(HTTP_STATUSES.CREATED_201);
    expect(res.body).toEqual(productMapper(mockUpdatedProduct));
  });

  it('should return 404 if product is not found', async () => {
    jest.spyOn(productRepository, 'updateProduct').mockResolvedValueOnce(null);

    const res = await requestTestApp.put('/products/123').send({ name: 'Updated Product', price: 20 });

    expect(res.status).toBe(HTTP_STATUSES.NOT_FOUND_404);
    expect(getTestValidErrorMessage(res)).toBe('Product not found');
  });

  it('should return 500 if an error occurs during processing', async () => {
    jest.spyOn(productRepository, 'updateProduct').mockRejectedValueOnce(new Error('Internal Server Error'));

    const res = await requestTestApp.put('/products/123').send({ name: 'Updated Product', price: 20 });

    expect(res.status).toBe(HTTP_STATUSES.SERVER_ERROR_500);
    expect(getTestValidErrorMessage(res)).toBe('Internal Server Error');
  });
});
