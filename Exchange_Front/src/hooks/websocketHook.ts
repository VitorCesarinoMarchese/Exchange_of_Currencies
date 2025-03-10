import { useEffect, useState } from "react"
import { exchangeRates } from "../models/exchangeRates"

export const useWebsocket = () =>{
    const [exchangeRates, setExchangeRates] = useState<exchangeRates | null>(null)

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:3031")

        socket.onopen = () => {
            console.log("Connected to the websocket server")
        }
        socket.onmessage = (event) => {
            try {
                const data: exchangeRates = JSON.parse(event.data)
                setExchangeRates(data)
            } catch (e) {
                console.log(e)
            }
        }
        socket.onclose = () =>{
            console.log("Disconnected from WebSocket server");
        }

        return () => {
            socket.close()
        }
    }, [])
    return exchangeRates
}