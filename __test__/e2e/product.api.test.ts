import { HTTP_STATUSES } from '../../src/constants';
import { requestTestApp, withAuthToken } from '../setupTests';

describe('/product', () => {
  it('Should return an empty array of products', async () => {
    const res = await requestTestApp.get('/products').set(withAuthToken);

    expect(res.statusCode).toBe(HTTP_STATUSES.OK_200);
    expect(res.body.length).toBe(0);
  });

  it('Should create a new product', async () => {
    expect((await requestTestApp.get('/products').set(withAuthToken)).body.length).toBe(0);

    const newProduct = {
      name: 'New Product',
    };
    const res = await requestTestApp.post('/products').set(withAuthToken).send(newProduct);

    expect(res.statusCode).toBe(HTTP_STATUSES.CREATED_201);
    expect(res.body.name).toBe(newProduct.name);
    expect((await requestTestApp.get('/products').set(withAuthToken)).body.length).toBe(1);
  });

  it('Should not create a new product without a current name', async () => {
    const newProduct = {
      name: '',
    };
    const res = await requestTestApp.post('/products').set(withAuthToken).send(newProduct);

    expect(res.statusCode).toBe(HTTP_STATUSES.BAD_REQUEST_400);
  });

  it('Should update the name of the product', async () => {
    const allProducts = await requestTestApp.get('/products').set(withAuthToken);
    expect(allProducts.body.length).toBeGreaterThan(0);

    const updatedProduct = {
      name: 'Updated Product',
    };

    const resUpdatedProduct = await requestTestApp
      .put(`/products/${allProducts.body[0].id}`)
      .set(withAuthToken)
      .send(updatedProduct);

    expect(resUpdatedProduct.statusCode).toBe(HTTP_STATUSES.CREATED_201);
    expect(resUpdatedProduct.body.name).toBe(updatedProduct.name);
  });

  it('Should not update the product with invalid data', async () => {
    const allProducts = await requestTestApp.get('/products').set(withAuthToken);
    expect(allProducts.body.length).toBeGreaterThan(0);
    expect(
      (
        await requestTestApp.put(`/products/${allProducts.body[0].id}`).set(withAuthToken).send({
          name: '',
        })
      ).statusCode,
    ).toBe(HTTP_STATUSES.BAD_REQUEST_400);
  });

  it('Should remove the product', async () => {
    const allProducts = await requestTestApp.get('/products').set(withAuthToken);
    expect(allProducts.body.length).toBeGreaterThan(0);

    expect((await requestTestApp.delete(`/products/${allProducts.body[0].id}`).set(withAuthToken)).statusCode).toBe(
      HTTP_STATUSES.NO_CONTENT_204,
    );
    expect((await requestTestApp.get('/products').set(withAuthToken)).body.length).toBe(allProducts.body.length - 1);
  });
});
