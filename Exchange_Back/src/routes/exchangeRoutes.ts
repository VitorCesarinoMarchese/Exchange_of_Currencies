import { Router } from "express";
import { getWalletController } from "../controllers/exchangeController";

const router = Router();

router.get("/wallet/:user_id", getWalletController);

export default router;  
