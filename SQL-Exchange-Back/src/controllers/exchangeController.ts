import { Request, Response } from "express";
import db from "../config/pgConfig";
import { validateToken } from "../utils/validateToken";
import { TransactionModel, TransactionsResponse } from "../models/transaction";
import { isPositiveNumber } from "../utils/typeValidation";
import userModel from "../models/user";

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
        const walletQuery = `SELECT * FROM wallets WHERE id = $1`;
        const oldWallet = (await db.query(walletQuery, [user.wallet_id]))
        .rows[0];
        if (oldWallet) {
          const newWalletQuery = `UPDATE wallets SET usd = $1, gbp = $2 WHERE id = $3;`;
          const newWallet = await db.query(newWalletQuery, [
            Number(oldWallet.usd) + usdValue,
            Number(oldWallet.gbp) + gbpValue,
            user.wallet_id,
          ]);
          const wallet = await db.query(walletQuery, [user.wallet_id]);
          if (newWallet.rowCount === 0) {
            res.status(500).json({ error: "Failed to update wallet" });
            return;
          }
          res.status(200).json({ wallet: wallet.rows[0] });
        }
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
          const wallet = (await db.query(walletQuery, [user.wallet_id])).rows[0];
          if (wallet) {
            const newAmount = amount * rate;
            if (currency == "USDGBP" && wallet.usd - amount < 0) {
              res.status(400).json({ error: "Insuficient funds" });
              return;
            }
            if (currency == "GBPUSD" && wallet.gbp - amount < 0) {
              res.status(400).json({ error: "Insuficient funds" });
              return;
            }
            if (currency == "USDGBP") {
              const updateQuery = `UPDATE wallets SET usd = $1, gbp = $2 WHERE id = $3;`;
              const newValueFrom = (Number(wallet.usd) - amount).toFixed(2);
              const newValueTo = (Number(wallet.gbp) + newAmount).toFixed(2);
              await db.query(updateQuery, [newValueFrom, newValueTo, user_id]);
            } else {
              const updateQuery = `UPDATE wallets SET usd = $1, gbp = $2 WHERE id = $3;`;
              const newValueTo = (Number(wallet.usd) + newAmount).toFixed(2);
              const newValueFrom = (Number(wallet.gbp) - amount).toFixed(2);
              await db.query(updateQuery, [newValueTo, newValueFrom, user_id]);
            }
            const queryTransaction = `INSERT INTO transactions (user_id, amount, "from", "to", rate) VALUES($1, $2, $3, $4, $5) RETURNING *`;
            const transaction: TransactionModel = (
              await db.query(queryTransaction, [
                user_id,
                amount,
                currency == "USDGBP" ? "usd" : "gbp",
                currency == "USDGBP" ? "gbp" : "usd",
                rate,
              ])
            ).rows[0];
            console.log(transaction)
            res.status(200).json({ document: transaction, total: amount * rate });
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
    res.status(200).json( {recentTransactions: transactions} );
  } catch (e: any) {
    res.status(500).json({ error: e.message || "Internal server error" });
  }
};
