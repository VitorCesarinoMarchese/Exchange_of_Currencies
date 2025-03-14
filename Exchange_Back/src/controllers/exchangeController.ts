import { Request, Response } from "express";
import users from "../models/user";
import { validateToken } from "../utils/validateToken";
import transactions from "../models/transaction";
import { isPositiveNumber } from "../utils/typeValidation";
import mongoose from "mongoose";

export const getWalletController = async (req: Request, res: Response) => {
  try {
    const user_id =  req.params.user_id;
    const token = req.header("Authorization");

    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      res.status(400).json({ error: "Invalid user id" });
      return;
    }

    if (!token) {
      res.status(403).json({ error: "Access denied" });
      return
    } else {
      const isValid = validateToken(token);
      if (isValid) {
        const user = await users.findOne({ _id: user_id });
        if (!user) {
          res.status(404).json({ error: "User not found" });
          return;
        }
        res.status(200).json({ wallet: user.wallet });
      } else {
        res.status(403).json({ error: "Invalid or expired token" });
        return
      }
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message || "Internal server error" });
  }
};
export const addFundsController = async (req: Request, res: Response) => {
  try {
    const user_id = req.params.user_id;
    const {usd, gbp} = req.body
    const token = req.header("Authorization");
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      res.status(400).json({ error: "Invalid user id" });
      return;
    }
    if(!usd || !gbp){
      res.status(400).json({ error: "USD and GBP amounts are required" });
      return
    }
    if(!isPositiveNumber(usd) || !isPositiveNumber(gbp)){
      res.status(400).json({ error: "USD and GBP amounts must be a positive number" });
      return
    }
    if (!token) {
      res.status(403).json({ error: "Access denied" });
    } else {
      const isValid = validateToken(token);
      if (isValid) {
        const user = await users.findOne({ _id: user_id });
        if (!user) {
          res.status(404).json({ error: "User not found" });
          return;
        }
        if(!user.wallet){
          res.status(404).json({ error: "User don't have a wallet" });
          return
        }
        user.wallet = {usd: user.wallet.usd + Number(usd), gbp: user.wallet.gbp + Number(gbp)}
        await user.save()
        res.status(200).json({ wallet: user.wallet });
      } else {
        res.status(403).json({ error: "Invalid or expired token" });
      }
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message || "Internal server error" });
  }
};
export const postTransaction = async (req: Request, res: Response) => {
  try {
    const { currency, amount, user_id, rate } = req.body;
    const token = req.header("Authorization");

    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      res.status(400).json({ error: "Invalid user id" });
      return;
    }

    if (!currency || !amount || !user_id || !rate) {
      res.status(400).json({ error: "Missing required data" });
      return;
    }
    if (currency !== "USDGBP" && currency !== "GBPUSD") {
      res.status(400).json({ error: "Currency can only be USDGBP or GBPUSD" });
      return;
    }
    if (!token) {
      res.status(401).json({ error: "Access denied" });
      return;
    } else {
      const isValid = validateToken(token);
      if (isValid) {
        const user = await users.findOne({ _id: user_id });

        if (!user) {
          res.status(404).json({ error: "User not found" });
          return;
        } else {
          if (user.wallet) {
            const newAmount = amount * rate;
            if(currency == "USDGBP" && user.wallet.usd - amount < 0){
              res.status(400).json({ error: "Insuficient founds" });
              return
            }
            if(currency == "GBPUSD" && user.wallet.gbp - amount < 0){
              res.status(400).json({ error: "Insuficient founds" });
              return
            }
            if (currency == "USDGBP") {
              user.wallet.usd = user.wallet.usd - amount;
              user.wallet.gbp = Number(
                (user.wallet.gbp + newAmount).toFixed(2)
              );
            } else {
              user.wallet.gbp = user.wallet.gbp - amount;
              user.wallet.usd = Number(
                (user.wallet.usd + newAmount).toFixed(2)
              );
            }
            await user.save();
            const document = new transactions({
              user_id: user_id,
              amount: amount,
              from: currency == "USDGBP" ? "usd" : "gbp",
              to: currency == "USDGBP" ? "gbp" : "usd",
              rate: rate,
            });
            await document.save();

            res.status(200).json({ document, total: amount * rate });
            return;
          }
          res.status(404).json({ error: "User wallet not found" });
        }
      } else {
        res.status(403).json({ error: "Invalid or expired token" });
      }
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message || "Internal server error" });
  }
};
export const getTransactions = async (req: Request, res: Response) => {
  const user_id = String(req.params.user_id);
  const token = req.header("Authorization");
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    res.status(400).json({ error: "Invalid user id" });
    return;
  }

  if (!token) {
    res.status(401).json({ error: "Access denied" });
    return;
  }





  const isValid = validateToken(token);

  if (!isValid) {
    res.status(403).json({ error: "Invalid or expired token" });
    return;
  }
  const user = await users.findOne({ _id: user_id });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  try {
    const recentTransactions = await transactions.find({ user_id: user_id });
    if (recentTransactions.length === 0 ) {
      res.status(404).json({ error: "Transactions not found" });
      return;
    }
    res.status(200).json({ recentTransactions });
  } catch (e: any) {
    res.status(500).json({ error: e.message || "Internal server error" });
  }

};
