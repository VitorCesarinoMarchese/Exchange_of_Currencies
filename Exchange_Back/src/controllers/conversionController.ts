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
        if(typeof userData.amount !== "number" || typeof userData.from !== "string" || typeof userData.to !== "string"){
            res.status(400).json({error: "Receive wrong types, amounts needs to be a number and from, to a string"})
            return
        }
        const result = await conversion(userData);
        if(!result.rate || !result.total){
            res.status(400).json({error: result.error})
            return 
        }
        res.status(200).json({ result });
    } catch (e: any) {
        res.status(500).json({ error: e.message || "Internal server error" });
    }
};
