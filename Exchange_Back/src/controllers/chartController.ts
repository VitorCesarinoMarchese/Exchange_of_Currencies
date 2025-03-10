import { Request, Response } from "express";
import { dayChart, weekChart, monthChart, yearChart } from "../utils/chartFunctions";

const isValidCurrency = (currency: string): boolean => {
    return currency === "USDGBP" || currency === "GBPUSD";
};

const handleChartRequest = async (req: Request, res: Response, chartFunction: (currency: string) => Promise<object>) => {
    try {
        const currency = String(req.params.currency);
        if (!isValidCurrency(currency)) {
            res.status(400).json({ error: "Invalid param, params must be USDGBP or GBPUSD" });
        }

        const result = await chartFunction(currency);
        res.json({ result });
    } catch (e: any) {
        res.status(500).json({ error: e.message || "Internal server error" });
    }
};


export const chartDayController = (req: Request, res: Response) => {
    handleChartRequest(req, res, dayChart);
};

export const chartWeekController = (req: Request, res: Response) => {
    handleChartRequest(req, res, weekChart);
};

export const chartMonthController = (req: Request, res: Response) => {
    handleChartRequest(req, res, monthChart);
};

export const chartYearController = (req: Request, res: Response) => {
    handleChartRequest(req, res, yearChart);
};
