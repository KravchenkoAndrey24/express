import express from "express";
import bodyParser from "body-parser";

export const app = express();

export const HTTP_STATUSES = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,

  BAD_REQUEST_400: 400,
  NOT_FOUND_404: 404,
};

const port = process.env.PORT || 3000;

const db = {
  products: [
    { id: 1, name: "Product 1" },
    { id: 2, name: "Product 2" },
    { id: 3, name: "Product 3" },
  ],
};

app.use(bodyParser.json());

app.get("/products", (req, res) => {
  if (req.query?.name) {
    const searchName = req.query?.name.toString();
    const foundProducts = db.products.filter((p) =>
      p.name.includes(searchName)
    );
    return res.json(foundProducts);
  }
  res.json(db.products);
});

app.get("/products/:productId", (req, res) => {
  const foundProduct = db.products.find(
    (p) => p.id === Number(req.params?.productId)
  );

  if (!foundProduct) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  }

  res.json(foundProduct);
});

app.post("/products", (req, res) => {
  console.log(req);

  if (!req.body?.name) {
    return res
      .status(HTTP_STATUSES.NOT_FOUND_404)
      .json({ message: "Invalid name" });
  }

  const newProduct = {
    id: new Date().getTime(),
    name: req.body?.name,
  };
  db.products.push(newProduct);

  return res.status(HTTP_STATUSES.CREATED_201).json(newProduct);
});

app.delete("/products/:productId", (req, res) => {
  db.products = db.products.filter(
    (p) => p.id !== Number(req.params.productId)
  );
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

app.put("/products/:productId", (req, res) => {
  db.products = db.products.map((p) => {
    if (p.id === Number(req.params.productId)) {
      return { ...req.body, id: p.id };
    }
    return p;
  });
  res.json(req.body);
});

app.delete("/__test__/data", (req, res) => {
  db.products = [];
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.delete("/__test__/close-server", (req, res) => {
  server.close();
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

// module.exports = app;
