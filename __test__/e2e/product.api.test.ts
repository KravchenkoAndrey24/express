import request from 'supertest';
import { HTTP_STATUSES } from '../../src/constants';
import { testApp } from './setupTests';

describe('/product', () => {
  it('Should return an empty array of products', async () => {
    const res = await request(testApp).get('/products');

    expect(res.statusCode).toBe(HTTP_STATUSES.OK_200);
    expect(res.body.length).toBe(0);
  });

  it('Should create a new product', async () => {
    expect((await request(testApp).get('/products')).body.length).toBe(0);

    const newProduct = {
      name: 'New Product',
    };
    const res = await request(testApp).post('/products').send(newProduct);

    expect(res.statusCode).toBe(HTTP_STATUSES.CREATED_201);
    expect(res.body.name).toBe(newProduct.name);
    expect((await request(testApp).get('/products')).body.length).toBe(1);
  });

  it('Should not create a new product without a current name', async () => {
    const newProduct = {
      name: '',
    };
    const res = await request(testApp).post('/products').send(newProduct);

    expect(res.statusCode).toBe(HTTP_STATUSES.BAD_REQUEST_400);
  });

  it('Should update the name of the product', async () => {
    const allProducts = await request(testApp).get('/products');
    expect(allProducts.body.length).toBeGreaterThan(0);

    const updatedProduct = {
      name: 'Updated Product',
    };

    const resUpdatedProduct = await request(testApp).put(`/products/${allProducts.body[0].id}`).send(updatedProduct);

    expect(resUpdatedProduct.statusCode).toBe(HTTP_STATUSES.CREATED_201);
    expect(resUpdatedProduct.body.name).toBe(updatedProduct.name);
  });

  it('Should not update the product with invalid data', async () => {
    const allProducts = await request(testApp).get('/products');
    expect(allProducts.body.length).toBeGreaterThan(0);
    expect(
      (
        await request(testApp).put(`/products/${allProducts.body[0].id}`).send({
          name: '',
        })
      ).statusCode,
    ).toBe(HTTP_STATUSES.BAD_REQUEST_400);
  });

  it('Should remove the product', async () => {
    const allProducts = await request(testApp).get('/products');
    expect(allProducts.body.length).toBeGreaterThan(0);

    expect((await request(testApp).delete(`/products/${allProducts.body[0].id}`)).statusCode).toBe(
      HTTP_STATUSES.NO_CONTENT_204,
    );
    expect((await request(testApp).get('/products')).body.length).toBe(allProducts.body.length - 1);
  });
});
