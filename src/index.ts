import express from "express";
import bodyParser from "body-parser";

const app = express();
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
    return res.send(404);
  }

  res.json(foundProduct);
});

app.post("/products", (req, res) => {
  console.log(req);

  if (!req.body?.name) {
    return res.status(404).json({ message: "Invalid name" });
  }

  const newProduct = {
    id: new Date().getTime(),
    name: req.body?.name,
  };
  db.products.push(newProduct);

  return res.status(201).json(newProduct);
});

app.delete("/products/:productId", (req, res) => {
  db.products = db.products.filter(
    (p) => p.id !== Number(req.params.productId)
  );
  res.send(204);
});

app.put("/products/:productId", (req, res) => {
  db.products = db.products.map((p) => {
    if (p.id === Number(req.params.productId)) {
      return { ...req.body, id: p.id };
    }
    return p;
  });
  res.send(req.body);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
