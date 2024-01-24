import express from "express";
import bodyParser from "body-parser";
import { getProductRouter } from "./product/routes/product.routes";
import { getDBRouter } from "./db/db.routes";
import { db } from "./db/db";

export const app = express();

app.use(bodyParser.json());

app.use("/products", getProductRouter(db));
app.use("/__test__", getDBRouter(db));
