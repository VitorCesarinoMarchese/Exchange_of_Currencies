import { Router } from "express";
import { addFundsController, getTransactions, getWalletController, postTransaction } from "../controllers/exchangeController";

const router = Router();

router.get("/wallet/:user_id", getWalletController);
router.post("/transaction", postTransaction);
router.get("/transaction_history/:user_id", getTransactions);
router.post("/addfunds/:user_id", addFundsController);

export default router;  
