import { DBType } from "../db/db.types";
import { Router } from "express";
import { HTTP_STATUSES } from "../constants";
import { db } from "../db/db";

export const testsRouter = Router();

testsRouter.delete("/data", (req, res) => {
  db.products = [];
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
