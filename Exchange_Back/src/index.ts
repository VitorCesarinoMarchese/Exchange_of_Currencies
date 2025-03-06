import express from "express"
import dotenv from "dotenv"
import cors from "cors";
import conversionRoutes from "./routes/conversionRoutes"
import chartRoutes from "./routes/chartRoutes"
import authRoutes from "./routes/authRoutes"
import exchangeRoutes from "./routes/exchangeRoutes"
import conn from "./config/database";

dotenv.config()

conn()

const app = express()
const port = process.env.PORT || 3030

app.use(express.json())

app.use(
    cors({
      origin: "http://localhost:5173", 
      credentials: true, 
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use("/api/conversion", conversionRoutes)
app.use("/api/chart", chartRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/exchange", exchangeRoutes)


app.listen(3030, ()=>{
    console.log("Server runing in http://localhost:" + port)
})