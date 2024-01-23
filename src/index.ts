import express from "express";
import bodyParser from "body-parser";
import {
  TypedRequestWithBody,
  TypedRequestWithParams,
  TypedRequestWithParamsAndBody,
  TypedRequestWithQuery,
  TypedResponse,
} from "./types";
import {
  ProductDBType,
  ProductInDto,
  ProductOutDto,
  ProductParamsType,
  ProductQueryType,
} from "./product/dto/ProductDto";
import { productMapper } from "./product/ProductMapper";

export const app = express();

export const HTTP_STATUSES = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,

  BAD_REQUEST_400: 400,
  NOT_FOUND_404: 404,
};

const port = process.env.PORT || 3000;

const db: { products: ProductDBType[] } = {
  products: [
    { id: 1, name: "Product 1", price: 10 },
    { id: 2, name: "Product 2", price: 20 },
    { id: 3, name: "Product 3", price: 30 },
  ],
};

app.use(bodyParser.json());

app.get(
  "/products",
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

app.get(
  "/products/:productId",
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

app.post(
  "/products",
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

app.delete(
  "/products/:productId",
  (req: TypedRequestWithParams<ProductParamsType>, res) => {
    db.products = db.products.filter(
      (p) => p.id !== Number(req.params.productId)
    );
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  }
);

app.put(
  "/products/:productId",
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

app.delete("/__test__/data", (req, res) => {
  db.products = [];
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

export const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
