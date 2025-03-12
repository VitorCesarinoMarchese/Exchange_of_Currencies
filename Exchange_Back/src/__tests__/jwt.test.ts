import request from "supertest";
import createServer from "../config/server";
import { generateTokens } from "../utils/generateJWT";
import { validateToken } from "../utils/validateToken";
import mongoose from "mongoose";

const { app } = createServer();

describe("jwt system", () => {
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
        expect(res.body).toEqual({ error: "Invalid refresh token" });
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
        const res = await request(app).post(`/api/auth/refresh-token`).send({
          refreshToken:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2QwMzZlMThkOTZjNTQ2YjI3YjI0ODIiLCJpYXQiOjE3NDE2OTg3OTcsImV4cCI6MTc0MjMwMzU5N30.OC4CW-G_sY98ZRQfVtF_PDgpVGzkhrLnyTiwY4JGimA",
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
          "67d036e18d96c546b27b2482"
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
        const invalidUserId = new mongoose.Types.ObjectId();
        const { accessToken, refreshToken, error } = await generateTokens(
          String(invalidUserId)
        );
        expect(error).toEqual("User not found");
      });
    });
    describe("given missing JWT environment variables", () => {
      it("Should return a error", async () => {
        const originalEnv = { ...process.env };
        delete process.env.JWT_SECRET;
        delete process.env.JWT_REFRESH_SECRET;
        try {
          const { accessToken, refreshToken, error } = await generateTokens(
            "67cf041c15ee0b79c5af4726"
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
          "67d036e18d96c546b27b2482"
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
