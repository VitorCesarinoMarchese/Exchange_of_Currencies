import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import WebSocket from "ws";
import conversionRoutes from "./routes/conversionRoutes";
import chartRoutes from "./routes/chartRoutes";
import authRoutes from "./routes/authRoutes";
import exchangeRoutes from "./routes/exchangeRoutes";
import conn from "./config/database";
import { webSocketServer } from "./controllers/websocketController";

dotenv.config();
conn();

const app = express();
const port = process.env.PORT || 3030; // Port for Express API

// WebSocket Server on a different port (e.g., 3031)
const wsPort = process.env.WS_PORT || 3031; // WebSocket server port

// Create HTTP server for WebSocket server
const server = http.createServer(app);

// Now, create WebSocket server by calling `new WebSocket.Server()`
const wsServer = new WebSocket.Server({ server });

webSocketServer(wsServer);

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Allow front-end
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/conversion", conversionRoutes);
app.use("/api/chart", chartRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/exchange", exchangeRoutes);

// Start Express API server
app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});

// Start WebSocket server on the same HTTP server
server.listen(wsPort, () => {
  console.log(`WebSocket server running on ws://localhost:${wsPort}`);
});
