import request from "supertest";
import { faker } from "@faker-js/faker";
import createServer from "../config/server";

const { app } = createServer();

describe("Auth system", () => {
  describe("Post Register", () => {
    describe("given the body does not exist", () => {
      it("Should return a 400", async () => {
        const res = await request(app).post(`/api/auth/register`).send({});
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "Missing required data" });
      });
    });
    describe("given the email is already in use", () => {
      it("Should return a 409", async () => {
        const res = await request(app).post(`/api/auth/register`).send({
          name: "tept",
          email: "tept@tept.com",
          password: "tept",
        });
        expect(res.status).toBe(409);
        expect(res.body).toEqual({ error: "Email already in use" });
      });
    });
    describe("given the user register is successful", () => {
      it("Should return a 201", async () => {
        const res = await request(app).post(`/api/auth/register`).send({
          name: faker.person.firstName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
        });
        expect(res.status).toBe(201);
        expect(res.body).toEqual({ message: "User registered successfully" });
      });
    });
  });

  describe("Post Login", () => {
    describe("given the body does not exist", () => {
      it("Should return a 400", async () => {
        const res = await request(app).post(`/api/auth/login`).send({});
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "Email and password are required" });
      });
    });
    describe("given the email is incorrect", () => {
      it("Should return a 401", async () => {
        const res = await request(app).post(`/api/auth/login`).send({
          email: "tepewewt@tept.com",
          password: "tept",
        });
        expect(res.status).toBe(401);
        expect(res.body).toEqual({ error: "Invalid email or password" });
      });
    });
    describe("given the password is incorrect", () => {
      it("Should return a 401", async () => {
        const res = await request(app).post(`/api/auth/login`).send({
          email: "tept@tept.com",
          password: "tepwewast",
        });
        expect(res.status).toBe(401);
        expect(res.body).toEqual({ error: "Invalid email or password" });
      });
    });
    describe("given the user login is successful", () => {
      it("Should return a 200", async () => {
        const res = await request(app).post(`/api/auth/login`).send({
          email: "tept@tept.com",
          password: "tept",
        });
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
          message: "Login successful",
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
          user: { id: 17, email: expect.any(String) },
        });
      });
    });
  });
});
