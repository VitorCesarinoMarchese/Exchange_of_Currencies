import { useEffect, useState, useRef } from "react";
import { exchangeRates } from "../@types/exchangeRates";

export const useWebsocket = () => {
    const [exchangeRates, setExchangeRates] = useState<exchangeRates | null>(null);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const connectWebSocket = () => {
            socketRef.current = new WebSocket("ws://localhost:3031");

            socketRef.current.onopen = () => {
                console.log("Connected to the WebSocket server");
            };

            socketRef.current.onmessage = (event) => {
                try {
                    const data: exchangeRates = JSON.parse(event.data);
                    setExchangeRates(prev => {
                        if (JSON.stringify(prev) !== JSON.stringify(data)) {
                            return data;
                        }
                        return prev;
                    });
                } catch (e) {
                    console.error("Error parsing WebSocket message:", e);
                }
            };

            socketRef.current.onclose = () => {
                setTimeout(connectWebSocket, 500); 
            };
        };

        connectWebSocket();

        return () => {
            socketRef.current?.close();
        };
    }, []);

    return exchangeRates;
};
