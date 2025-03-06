import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import users from "../models/user";
import { validateToken } from "../utils/validateToken";
import { exchangeLogic } from "../utils/exchangeLogic";

export const getWalletController = async (req: Request, res: Response) => {
  try {

    const user_id = String(req.params.user_id);
    const token = req.header("Authorization");

    if (!token) {
      res.status(403).json({ error: "Access denied" });
    } else {
      const isValid =validateToken(token)
      if(isValid){
        const user = await users.findOne({_id: user_id})
        if(!user){
          res.status(404).json({error: "User not found"})
        }
        res.status(200).json({wallet: user?.wallet})
      }else{
        res.status(403).json({error: "Invalid or expired token"})
      }
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message || "Internal server error" });
  }
};

export const postTransaction = async (req: Request, res: Response) => {
    try {
      const {currency, amount, user_id} = req.body
      const token = req.header("Authorization");

      if (!token) {
        res.status(403).json({ error: "Access denied" });
      } else {
        const isValid =validateToken(token)
        if(isValid){
          const user = await users.findOne({_id: user_id})
          if(!user){
            res.status(404).json({error: "User not found"})
          }
          res.status(200).json({wallet: user?.wallet})
        }else{
          res.status(403).json({error: "Invalid or expired token"})
        }
      }
      if(!currency || !amount) res.status(400).json({ error: "Missing required data" });

      // exchangeLogic()

    } catch (e: any) {
      res.status(500).json({ error: e.message || "Internal server error" });
    }
}