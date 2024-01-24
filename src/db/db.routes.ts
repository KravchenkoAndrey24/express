import { DBType } from "./db.types";
import { Router } from "express";
import { HTTP_STATUSES } from "../constants";

export const getDBRouter = (db: DBType) => {
  const router = Router();

  router.delete("/data", (req, res) => {
    db.products = [];
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  });

  return router;
};
