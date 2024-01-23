import request from "supertest";
import { app, HTTP_STATUSES } from "../../src";

describe("/product", () => {
  beforeAll(async () => {
    await request(app)
      .delete("/__test__/data")
      .expect(HTTP_STATUSES.NO_CONTENT_204);
  });

  afterAll(async () => {
    await request(app)
      .delete("/__test__/close-server")
      .expect(HTTP_STATUSES.NO_CONTENT_204);
  });

  it("Should return HTTP_STATUSES.OK_200 and empty array", async () => {
    await request(app).get("/products").expect(HTTP_STATUSES.OK_200, []);
  });

  it("Should return HTTP_STATUSES.NOT_FOUND_404 for not existing product", async () => {
    await request(app)
      .get("/products/1")
      .expect(HTTP_STATUSES.NOT_FOUND_404, "Not Found");
  });
});
