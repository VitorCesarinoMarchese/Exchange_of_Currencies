import { Router } from "express";
import { chartDayController, chartMonthController, chartWeekController, chartYearController } from "../controllers/chartController";

const router = Router();

router.get("/day/:currency", chartDayController);
router.get("/week/:currency", chartWeekController);
router.get("/month/:currency", chartMonthController);
router.get("/year/:currency", chartYearController);



export default router;
