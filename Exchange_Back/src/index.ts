import dotenv from "dotenv";
import WebSocket from "ws";
import createServer from "./config/server";
import { webSocketServer } from "./controllers/websocketController";

dotenv.config();
const port = process.env.PORT || 3030;
const wsPort = process.env.WS_PORT || 3031;

const { app, server } = createServer();

const wsServer = new WebSocket.Server({ server });
webSocketServer(wsServer);

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});

server.listen(wsPort, () => {
  console.log(`WebSocket server running on ws://localhost:${wsPort}`);
});
