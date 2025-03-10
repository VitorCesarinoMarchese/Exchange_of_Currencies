import { Request, Response } from "express";
import { conversion } from "../utils/conversionFunctions"; 

export const conversionController = async (req: Request, res: Response) => {
    try {
        const userData = req.body;

        const result = await conversion(userData);
        if(!result.rate || !result.total){
            res.status(400).json(result)
            return
        }
        res.status(200).json({ result });
    } catch (e: any) {
        res.status(500).json({ error: e.message || "Internal server error" });
    }
};
