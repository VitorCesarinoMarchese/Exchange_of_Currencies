import { Request, Response } from "express";
import { conversion } from "../utils/conversionFunctions"; 
import { conversionBody } from "../@types/conversionBody";

export const conversionController = async (req: Request, res: Response) => {
    try {
        const userData: conversionBody = req.body;
        if(!userData.amount || !userData.from || !userData.to){
            res.status(400).json({error: "Amount, from and to are required"})
            return
        }
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
