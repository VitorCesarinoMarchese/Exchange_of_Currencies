import WebSocket from "ws";
import { getExchangeRates, addSubscriber } from "../utils/webSocket";

export const webSocketServer = (wss: WebSocket.Server) => {
    wss.on("connection", (ws: WebSocket) => {
        console.log("Client connected");

        addSubscriber(ws);

        ws.send(JSON.stringify(getExchangeRates()));

        ws.on("close", () => {
            console.log("Client disconnected");
        });
    });
};
