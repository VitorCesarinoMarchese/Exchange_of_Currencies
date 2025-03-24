import request from "supertest";
import createServer from "../config/server";

const { app } = createServer();

describe("Conversion system", () => {
  describe("Post conversion", () => {
    describe("given the body does not exist", () => {
      it("Should return a 400", async () => {
        const res = await request(app).post(`/api/conversion`).send({});
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "Amount, from and to are required" });
      });
    });
    describe("given the wrong currency pair", () => {
      it("Should return a 400", async () => {
        const res = await request(app)
          .post(`/api/conversion`)
          .send({ amount: 10, from: "YEN", to: "GBP" });
        expect(res.status).toBe(400);

        expect(res.body).toEqual("Invalid currency pair");
      });
    });
    describe("given the correct data", () => {
      it("Should return a 200", async () => {
        const res = await request(app)
          .post(`/api/conversion`)
          .send({ amount: 10, from: "USD", to: "GBP" });
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
          result: { total: expect.any(Number), rate: expect.any(Number) },
        });
      });
    });
  });
});
