import { Request, Response } from "express";
import db from "../config/pgConfig";
import { validateToken } from "../utils/validateToken";
import { TransactionModel, TransactionsResponse } from "../models/transaction";
import { isPositiveNumber } from "../utils/typeValidation";
import userModel from "../models/user";
import { TransactionJob } from "../@types/transactionJob";
import transactionQueue from "../utils/queueUtils";

export const getWalletController = async (req: Request, res: Response) => {
  try {
    const user_id = req.params.user_id;
    const token = req.header("Authorization");

    if (!token) {
      res.status(403).json({ error: "Access denied" });
      return;
    } else {
      const isValid = validateToken(token);
      if (isValid) {
        const queryString = `SELECT * FROM users WHERE id = $1`;
        const user: userModel = (await db.query(queryString, [user_id]))
          .rows[0];
        if (!user) {
          res.status(404).json({ error: "User not found" });
          return;
        }
        const walletQuery = `SELECT * FROM wallets WHERE id = $1`;
        const wallet = (await db.query(walletQuery, [user.wallet_id])).rows[0];
        res.status(200).json({ wallet: wallet });
      } else {
        res.status(403).json({ error: "Invalid or expired token" });
        return;
      }
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message || "Internal server error" });
  }
};
export const addFundsController = async (req: Request, res: Response) => {
  try {
    const user_id = req.params.user_id;
    const { usd, gbp } = req.body;
    const token = req.header("Authorization");
    if (!usd || !gbp) {
      res.status(400).json({ error: "USD and GBP amounts are required" });
      return;
    }
    if (!isPositiveNumber(usd) || !isPositiveNumber(gbp)) {
      res
        .status(400)
        .json({ error: "USD and GBP amounts must be a positive number" });
      return;
    }
    if (!token) {
      res.status(403).json({ error: "Access denied" });
    } else {
      const isValid = validateToken(token);
      if (isValid) {
        const usdValue = Number(usd);
        const gbpValue = Number(gbp);

        if (isNaN(usdValue) || isNaN(gbpValue)) {
          res.status(400).json({ error: "Invalid USD or GBP values" });
          return;
        }

        const queryString = `SELECT * FROM users WHERE id = $1`;
        const user: userModel = (await db.query(queryString, [user_id]))
          .rows[0];
        if (!user) {
          res.status(404).json({ error: "User not found" });
          return;
        }

        const jobData: TransactionJob = {
          wallet_id: user.wallet_id ? user.wallet_id : 0,
          user_id: user.id,
          amount: 0,
          usd: usdValue,
          gbp: gbpValue,
          type: "addFunds",
          from: "usd",
          to: "gbp",
          rate: 0,
        };
        const job = await transactionQueue.add(jobData, { delay: 3000 });

        await job.finished();

        const walletResult = await db.query(
          `SELECT * FROM wallets WHERE id = $1`,
          [user.wallet_id]
        );
        if (!walletResult.rows.length) throw new Error("Wallet not found");
        res.status(200).json({ wallet: walletResult.rows[0] });
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
        const queryString = `SELECT * FROM users WHERE id = $1`;
        const user: userModel = (await db.query(queryString, [user_id]))
          .rows[0];
        if (!user) {
          res.status(404).json({ error: "User not found" });
          return;
        } else {
          const walletQuery = `SELECT * FROM wallets WHERE id = $1`;
          const wallet = (await db.query(walletQuery, [user.wallet_id]))
            .rows[0];
          if (wallet) {
            if (currency == "USDGBP" && Number(wallet.usd) < amount) {
              res.status(400).json({ error: "Insuficient funds" });
              return;
            }
            if (currency == "USDGBP" && Number(wallet.gbp) < amount){
              res.status(400).json({ error: "Insuficient funds" });
              return;
            }
            const jobData: TransactionJob = {
              wallet_id: user.wallet_id ? user.wallet_id : 0,
              user_id: user.id,
              amount: amount,
              usd: 0,
              gbp: 0,
              type: "exchange",
              from: currency == "USDGBP" ? "usd" : "gbp",
              to: currency == "USDGBP" ? "gbp" : "usd",
              rate: rate,
            };
            const job = await transactionQueue.add(jobData);
            await job.finished();
            const queryTransaction = `SELECT * FROM transactions WHERE user_id = $1 AND amount = $2 ORDER BY transaction_date DESC LIMIT 1;`;
            const transaction: TransactionModel = (
              await db.query(queryTransaction, [user_id, amount])
            ).rows[0];
            res
              .status(200)
              .json({ document: transaction, total: amount * rate });
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

  if (!token) {
    res.status(401).json({ error: "Access denied" });
    return;
  }

  const isValid = validateToken(token);

  if (!isValid) {
    res.status(403).json({ error: "Invalid or expired token" });
    return;
  }
  const queryString = `SELECT * FROM users WHERE id = $1`;
  const user: userModel = (await db.query(queryString, [user_id])).rows[0];
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  try {
    const queryTransactions = `SELECT * FROM transactions WHERE user_id = $1`;
    const transactions: TransactionsResponse[] = (
      await db.query(queryTransactions, [user_id])
    ).rows;
    if (transactions.length === 0) {
      res.status(404).json({ error: "Transactions not found" });
      return;
    }
    res.status(200).json({ recentTransactions: transactions });
  } catch (e: any) {
    res.status(500).json({ error: e.message || "Internal server error" });
  }
};
