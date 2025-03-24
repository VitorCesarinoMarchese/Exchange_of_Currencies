import { Request, Response } from "express";
import userModel from "../models/user";
import bcrypt from "bcrypt";
import db from "../config/pgConfig";
import { generateTokens } from "../utils/generateJWT";

export const registerController = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: "Missing required data" });
      return;
    }

    const queryString = `SELECT email from users WHERE email = $1`;

    const verifyEmail = await db.query(queryString, [email]);
    
    if (verifyEmail.rowCount != 0) {
      res.status(409).json({ error: "Email already in use" });
      return;
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await db.query("BEGIN", []);

    const queryCreationUser = `INSERT INTO users 
    (name, email, password, wallet_id) 
    values($1, $2, $3, $4) RETURNING *`;

    const queryCreationWallet = `INSERT INTO wallets 
    (usd, gbp) 
    values($1, $2) RETURNING *`;

    const wallet = await db.query(queryCreationWallet, [100.0, 100.0]);
    const user = await db.query(queryCreationUser, [
      name,
      email,
      hashPassword,
      wallet.rows[0].id,
    ]);

    await db.query("COMMIT", []);

    res.status(201).json({ message: "User registered successfully" });
  } catch (e) {
    await db.query("ROLLBACK", []);
    console.error("Error in registerController", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }
    const queryString = `SELECT * FROM users WHERE email = $1`;

    const user: userModel = (await db.query(queryString, [email])).rows[0];
    if (!user || !user.password) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const { accessToken, refreshToken } = await generateTokens(String(user.id));

    const refreshInsertQuery = `UPDATE users SET refreshToken = $1 WHERE id = $2`;
    await db.query(refreshInsertQuery, [accessToken, user.id]);

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email },
    });
  } catch (e) {
    console.error("Error in loginController", e);
    res.status(500).json({ error: "Internal server error" });
  }
};
