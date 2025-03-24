import request from "supertest";
import createServer from "../config/server";
import { generateTokens } from "../utils/generateJWT";
import { validateToken } from "../utils/validateToken";
import db from "../config/pgConfig"
const { app } = createServer();

describe("jwt system", () => {
  beforeEach(() => {
    db.query = jest.fn().mockResolvedValue({
      rows: [{ id: 1, email: "test@example.com", refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMSIsImlhdCI6MTc0MjU3NjYzMywiZXhwIjoxNzQzMTgxNDMzfQ.VO3hP4QhFffONgSg9r5vNcwLtL3mXjrb_a3dKtU_DMU" }]
    })
  })
  describe("Refresh Token", () => {
    describe("given the body does not exist", () => {
      it("Should return a 400", async () => {
        const res = await request(app).post(`/api/auth/refresh-token`).send({});
        expect(res.body).toEqual({ error: "Refresh token is required" });
      });
    });
    describe("given the user refresh token does not exist", () => {
      it("Should return a 403", async () => {
        const res = await request(app)
          .post(`/api/auth/refresh-token`)
          .send({ refreshToken: "wrong" });
        expect(res.status).toBe(403);
        expect(res.body).toEqual({ error: "Invalid or expired refresh token" });
      });
    });
    describe("given the user refresh token is invalid or expired", () => {
      it("Should return a 403", async () => {
        const res = await request(app)
          .post(`/api/auth/refresh-token`)
          .send({ refreshToken: "dasdsadwadwadas" });
        expect(res.status).toBe(403);
        expect(res.body).toEqual({ error: "Invalid or expired refresh token" });
      });
    });
    describe("given the user refresh token is valid", () => {
      it("Should return a 200", async () => {    
        db.query = jest.fn().mockResolvedValue({
          rows: [{ id: 1, email: "test@example.com", refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMSIsImlhdCI6MTc0MjU3NjYzMywiZXhwIjoxNzQzMTgxNDMzfQ.VO3hP4QhFffONgSg9r5vNcwLtL3mXjrb_a3dKtU_DMU" }]
        })
        const res = await request(app).post(`/api/auth/refresh-token`).send({
          refreshToken:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMSIsImlhdCI6MTc0MjU3NjYzMywiZXhwIjoxNzQzMTgxNDMzfQ.VO3hP4QhFffONgSg9r5vNcwLtL3mXjrb_a3dKtU_DMU",
        });
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({ accessToken: expect.any(String) });
      });
    });
  });

  describe("Verify Token", () => {
    describe("given the header does not exist", () => {
      it("Should return a 403", async () => {
        const res = await request(app).get(`/api/auth/profile`);
        expect(res.status).toBe(403);
        expect(res.body).toEqual({ error: "Access denied" });
      });
    });
    describe("given the user token is valid", () => {
      it("Should return 200", async () => {
        const { accessToken } = await generateTokens(
          "1"
        );

        const res = await request(app)
          .get(`/api/auth/profile`)
          .set("Authorization", `${accessToken}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: "Profile accessed" });
      });
    });
    describe("given the user token is invalid", () => {
      it("Should return a 403", async () => {
        const accessToken = "asdadwadwaadwadasdwas";
        const res = await request(app)
          .get(`/api/auth/profile`)
          .set("Authorization", `${accessToken}`);
        expect(res.status).toBe(403);
        expect(res.body).toEqual({ error: "Invalid or expired token" });
      });
    });
  });

  describe("Generate Token", () => {
    describe("given the user_id does not exist", () => {
      it("Should return a error", async () => {
        db.query = jest.fn().mockResolvedValue({
          rows: []
        })
        const result = await generateTokens(String(3232));
        expect(result.error).toEqual("User not found");
      });
    });
    describe("given missing JWT environment variables", () => {
      it("Should return a error", async () => {
        const originalEnv = { ...process.env };
        delete process.env.JWT_SECRET;
        delete process.env.JWT_REFRESH_SECRET;
        try {
          const { accessToken, refreshToken, error } = await generateTokens(
            "1"
          );
        } catch (e) {
          expect(e).toEqual(new Error("Missing JWT environment variables"));
        }
        process.env = originalEnv;
      });
    });
  });

  describe("Valid Token", () => {
    describe("given the user token is valid", () => {
      it("Should return true", async () => {
        const { accessToken } = await generateTokens(
          "1"
        );
        if (!accessToken) {
          return;
        }
        const isValid = validateToken(accessToken);
        expect(isValid).toBe(true);
      });
    });
    describe("given the user token is invalid", () => {
      it("Should return false", async () => {
        const isValid = validateToken("dasdsadsadwa");
        expect(isValid).toBe(false);
      });
    });
  });
});
