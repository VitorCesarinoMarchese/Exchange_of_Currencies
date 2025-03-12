import express from "express";
import http from "http";
import cors from "cors";
import conversionRoutes from "../routes/conversionRoutes";
import chartRoutes from "../routes/chartRoutes";
import authRoutes from "../routes/authRoutes";
import exchangeRoutes from "../routes/exchangeRoutes";
import conn from "./database";

const createServer = () => {
  conn();

  const app = express();


  const server = http.createServer(app);

  app.use(express.json());
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  app.use("/api/conversion", conversionRoutes);
  app.use("/api/chart", chartRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/exchange", exchangeRoutes);

  return { app, server };
};
export default createServer;
