import WebSocket from "ws";
import { getExchangeRates, addSubscriber } from "../utils/webSocket";

export const webSocketServer = (wss: WebSocket.Server) => {
    wss.on("connection", (ws: WebSocket) => {
        console.log("Client connected");

        addSubscriber(ws);

        const sendRates = () => {
            const rates = getExchangeRates();

            
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(rates));
                }
            });
        };

        sendRates();
        ws.on("close", () => {
            console.log("Client disconnected");
        });

        setInterval(sendRates, 500);
    });
};
