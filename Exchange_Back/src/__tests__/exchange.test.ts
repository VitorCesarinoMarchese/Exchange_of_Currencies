import request from "supertest";
import createServer from "../config/server";
import users from "../models/user";
import mongoose from "mongoose";
import { validateToken } from "../utils/validateToken";


jest.mock("../utils/validateToken", () => ({
  validateToken: jest.fn(),
}));

const { app } = createServer();

describe("Exchange System", () => {
  describe("Get Wallet", () => {
    describe("given the user id is a wrong type", () => {
      it("Should return a 400", async () => {
        const res = await request(app)
          .get(`/api/exchange/wallet/dasdsa`)
          .set("Authorization", "valid-token");
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "Invalid user id" });
      });
    });

    describe("given the Authorization token is missing", () => {
      it("Should return a 403", async () => {
        const userId = new mongoose.Types.ObjectId();
        const res = await request(app).get(`/api/exchange/wallet/${userId}`);
        expect(res.status).toBe(403);
        expect(res.body).toEqual({ error: "Access denied" });
      });
    });

    describe("given the Authorization token is invalid", () => {
      it("Should return a 403", async () => {
        (validateToken as jest.Mock).mockReturnValue(false);
        const userId = new mongoose.Types.ObjectId();
        const res = await request(app)
          .get(`/api/exchange/wallet/${userId}`)
          .set("Authorization", "invalid-token");
        expect(res.status).toBe(403);
        expect(res.body).toEqual({ error: "Invalid or expired token" });
      });
    });

    describe("given the user does not exist", () => {
      it("Should return a 404", async () => {
        (validateToken as jest.Mock).mockReturnValue(true);
        const userId = new mongoose.Types.ObjectId();
        jest.spyOn(users, "findOne").mockResolvedValueOnce(null);
        const res = await request(app)
          .get(`/api/exchange/wallet/${userId}`)
          .set("Authorization", "valid-token");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: "User not found" });
      });
    });

    describe("given the user exists and has a wallet", () => {
      it("Should return a 200", async () => {
        (validateToken as jest.Mock).mockReturnValue(true);
        const userId = "67d036e18d96c546b27b2482";
        const res = await request(app)
          .get(`/api/exchange/wallet/${userId}`)
          .set("Authorization", "valid-token");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          wallet: {
            usd: expect.any(Number),
            gbp: expect.any(Number),
          },
        });
      });
    });
  });

  describe("Add Funds", () => {
    describe("given the user id is a wrong type", () => {
      it("Should return a 400", async () => {
        const res = await request(app)
          .post(`/api/exchange/addfunds/dasdsa`)
          .set("Authorization", "valid-token")
          .send({});
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "Invalid user id" });
      });
    });

    describe("given the body dont have usd or gbp", () => {
      it("Should return a 400", async () => {
        const userId = new mongoose.Types.ObjectId();
        const res = await request(app)
          .post(`/api/exchange/addfunds/${userId}`)
          .set("Authorization", "valid-token")
          .send({});
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "USD and GBP amounts are required" });
      });
    });

    describe("given the usd, gbp types are wrong", () => {
      it("Should return a 400", async () => {
        const userId = new mongoose.Types.ObjectId();
        const res = await request(app)
          .post(`/api/exchange/addfunds/${userId}`)
          .set("Authorization", "valid-token")
          .send({ usd: "100", gbp: "40" });
        expect(res.status).toBe(400);
        expect(res.body).toEqual({
          error: "USD and GBP amounts must be a positive number",
        });
      });
    });

    describe("given the Authorization token is missing", () => {
      it("Should return a 403", async () => {
        const userId = new mongoose.Types.ObjectId();
        const res = await request(app)
          .post(`/api/exchange/addfunds/${userId}`)
          .send({ usd: 100, gbp: 40 });
        expect(res.status).toBe(403);
        expect(res.body).toEqual({ error: "Access denied" });
      });
    });

    describe("given the Authorization token is invalid", () => {
      it("Should return a 403", async () => {
        (validateToken as jest.Mock).mockReturnValue(false);
        const userId = new mongoose.Types.ObjectId();
        const res = await request(app)
          .post(`/api/exchange/addfunds/${userId}`)
          .set("Authorization", "invalid-token")
          .send({ usd: 100, gbp: 40 });
        expect(res.status).toBe(403);
        expect(res.body).toEqual({ error: "Invalid or expired token" });
      });
    });

    describe("given the user does not exist", () => {
      it("Should return a 404", async () => {
        (validateToken as jest.Mock).mockReturnValue(true);
        const userId = new mongoose.Types.ObjectId();
        jest.spyOn(users, "findOne").mockResolvedValueOnce(null);
        const res = await request(app)
          .post(`/api/exchange/addfunds/${userId}`)
          .set("Authorization", "valid-token")
          .send({ usd: 100, gbp: 40 });
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: "User not found" });
      });
    });

    describe("given the user exists and has a wallet", () => {
      it("Should return a 200", async () => {
        (validateToken as jest.Mock).mockReturnValue(true);
        const userId = "67d036e18d96c546b27b2482";
        const res = await request(app)
          .post(`/api/exchange/addfunds/${userId}`)
          .set("Authorization", "valid-token")
          .send({ usd: 100, gbp: 100 });
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          wallet: {
            usd: expect.any(Number),
            gbp: expect.any(Number),
          },
        });
      });
    });
  });

  describe("Post transaction", () => {
    describe("given the user id is a wrong type", () => {
      it("Should return a 400", async () => {
        const res = await request(app)
          .post(`/api/exchange/transaction`)
          .set("Authorization", "valid-token")
          .send({
            currency: "USDGBP",
            amount: 100,
            user_id: "adwa21",
            rate: 1,
          });
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "Invalid user id" });
      });
    });

    describe("given missing required data", () => {
      it("Should return a 400", async () => {
        const user_id = new mongoose.Types.ObjectId();
        const res = await request(app)
          .post(`/api/exchange/transaction`)
          .set("Authorization", "valid-token")
          .send({ user_id });
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "Missing required data" });
      });
    });

    describe("given incorrect currency", () => {
      it("Should return a 400", async () => {
        const user_id = new mongoose.Types.ObjectId();
        const res = await request(app)
          .post(`/api/exchange/transaction`)
          .set("Authorization", "valid-token")
          .send({ currency: "YENGBP", amount: 100, user_id, rate: 1 });
        expect(res.status).toBe(400);
        expect(res.body).toEqual({
          error: "Currency can only be USDGBP or GBPUSD",
        });
      });
    });

    describe("given missing token", () => {
      it("Should return a 401", async () => {
        const user_id = new mongoose.Types.ObjectId();
        const res = await request(app)
          .post(`/api/exchange/transaction`)
          .send({ currency: "USDGBP", amount: 100, user_id, rate: 1 });
        expect(res.status).toBe(401);
        expect(res.body).toEqual({ error: "Access denied" });
      });
    });

    describe("given the Authorization token is invalid", () => {
      it("Should return a 403", async () => {
        (validateToken as jest.Mock).mockReturnValue(false);
        const user_id = new mongoose.Types.ObjectId();
        const res = await request(app)
          .post(`/api/exchange/transaction`)
          .set("Authorization", "invalid-token")
          .send({ currency: "USDGBP", amount: 100, user_id, rate: 1 });
        expect(res.status).toBe(403);
        expect(res.body).toEqual({ error: "Invalid or expired token" });
      });
    });

    describe("given the user does not exist", () => {
      it("Should return a 404", async () => {
        (validateToken as jest.Mock).mockReturnValue(true);
        const user_id = new mongoose.Types.ObjectId();
        jest.spyOn(users, "findOne").mockResolvedValueOnce(null);
        const res = await request(app)
          .post(`/api/exchange/transaction`)
          .set("Authorization", "valid-token")
          .send({ currency: "USDGBP", amount: 100, user_id, rate: 1 });
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: "User not found" });
      });
    });

    describe("given the user does not have enought funds", () => {
      it("Should return a 400", async () => {
        (validateToken as jest.Mock).mockReturnValue(true);
        const user_id = "67d036e18d96c546b27b2482";
        const res = await request(app)
          .post(`/api/exchange/transaction`)
          .set("Authorization", "valid-token")
          .send({ currency: "USDGBP", amount: 100000, user_id, rate: 1 });
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "Insuficient funds" });
      });
    });

    describe("given the user have enought funds", () => {
      it("Should return a 200", async () => {
        (validateToken as jest.Mock).mockReturnValue(true);
        const user_id = "67d036e18d96c546b27b2482";
        const res = await request(app)
          .post(`/api/exchange/transaction`)
          .set("Authorization", "valid-token")
          .send({ currency: "USDGBP", amount: 1, user_id, rate: 1 });
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
          document: expect.objectContaining({
            _id: expect.any(String),
            user_id: expect.any(String),
            amount: expect.any(String),
            from: expect.any(String),
            to: expect.any(String),
            rate: expect.any(String),
            transaction_date: expect.any(String),
          }),
          total: expect.any(Number),
        });
      });
    });
  });

  describe("Get transaction", () => {
    describe("given the user id is a wrong type", () => {
      it("Should return a 400", async () => {
        const res = await request(app)
          .get(`/api/exchange/transaction_history/adsdwasjdas`)
          .set("Authorization", "valid-token");
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "Invalid user id" });
      });
    });

    describe("given missing token", () => {
      it("Should return a 401", async () => {
        const user_id = new mongoose.Types.ObjectId();
        const res = await request(app).get(
          `/api/exchange/transaction_history/${user_id}`
        );
        expect(res.status).toBe(401);
        expect(res.body).toEqual({ error: "Access denied" });
      });
    });

    describe("given the Authorization token is invalid", () => {
      it("Should return a 403", async () => {
        (validateToken as jest.Mock).mockReturnValue(false);
        const user_id = new mongoose.Types.ObjectId();
        const res = await request(app)
          .get(`/api/exchange/transaction_history/${user_id}`)
          .set("Authorization", "invalid-token");
        expect(res.status).toBe(403);
        expect(res.body).toEqual({ error: "Invalid or expired token" });
      });
    });

    describe("given the user does not exist", () => {
      it("Should return a 404", async () => {
        (validateToken as jest.Mock).mockReturnValue(true);
        const user_id = new mongoose.Types.ObjectId();
        const res = await request(app)
          .get(`/api/exchange/transaction_history/${user_id}`)
          .set("Authorization", "valid-token");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: "User not found" });
      });
    });

    describe("given the user does not have transactions", () => {
      it("Should return a 404", async () => {
        (validateToken as jest.Mock).mockReturnValue(true);
        const user_id = "67d039f0b06d47349cbdb85b";
        const res = await request(app)
          .get(`/api/exchange/transaction_history/${user_id}`)
          .set("Authorization", "valid-token");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: "Transactions not found" });
      });
    });

    describe("given the user does have transactions", () => {
      it("Should return a 200", async () => {
        (validateToken as jest.Mock).mockReturnValue(true);
        const user_id = "67cf041c15ee0b79c5af4726";
        const res = await request(app)
          .get(`/api/exchange/transaction_history/${user_id}`)
          .set("Authorization", "valid-token");
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
          recentTransactions: expect.arrayContaining([
            expect.objectContaining({
              _id: expect.any(String),
              user_id: expect.any(String),
              amount: expect.any(String),
              from: expect.any(String),
              to: expect.any(String),
              rate: expect.any(String),
              transaction_date: expect.any(String),
            }),
          ]),
        });
      });
    });
  });
});
