import dotenv from "dotenv";
dotenv.config();
import WebSocket from "ws";
import { ApiLiveRatesResponse } from "../@types/api_response";  

let exchangeRates = { GBPUSD: 1.27, USDGBP: 0.78, TS: Date.now().toString() };
let reconnectInterval = 1000 * 10;

const subscribers: WebSocket[] = []; // Store connected clients

export const connect = () => {
    if (!process.env.URL_WEBSOCKET) {
        throw new Error("WebSocket URL is not set in the environment variables.");
    }

    const ws = new WebSocket(process.env.URL_WEBSOCKET);

    ws.on("open", function open() {
        ws.send(`{"userKey":"${process.env.API_KEY_WEBSOCKET}", "symbol":"GBPUSD"}`);
    });

    ws.on("close", function () {
        console.log(`socket closed, will reconnect in ${reconnectInterval}`);
        setTimeout(connect, reconnectInterval);
    });

    ws.on("message", function incoming(data: string) {
        if (data !== "Connected") {
            try {
                const parsedData: ApiLiveRatesResponse = JSON.parse(data);
                exchangeRates.GBPUSD = parsedData.ask;
                exchangeRates.USDGBP = 1 / parsedData.ask;
                exchangeRates.TS = parsedData.ts;

                // Broadcast new exchange rates to all WebSocket clients
                subscribers.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(exchangeRates));
                    }
                });
            } catch (error) {
                console.error("Error parsing message:", error);
            }
        }
    });
};

// Allow WebSocket clients to subscribe to updates
export const addSubscriber = (ws: WebSocket) => {
    subscribers.push(ws);
};

export const getExchangeRates = () => {
    return exchangeRates;
};

connect();
