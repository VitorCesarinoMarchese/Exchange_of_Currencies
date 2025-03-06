import { Router } from "express";
import { conversionController } from "../controllers/conversionController";

const router = Router();

router.post("/", conversionController);

export default router;  
