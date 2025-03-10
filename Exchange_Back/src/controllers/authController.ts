import { Request, Response } from "express";
import conn from "../config/database";
import users from "../models/user";
import bcrypt from "bcrypt";
import { generateTokens } from "../utils/generateJWT";

export const registerController = async (req: Request, res: Response) => {
  try {

    const { name, email, password } = req.body;
      
    if (!name || !email || !password) {
      res.status(400).json({ error: "Missing required data" });
      return
    }

    const verifyEmail = await users.findOne({ email });
    if (verifyEmail) {
      res.status(409).json({ error: "Email already in use" });
      return
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const document = new users({
      name: name,
      email: email,
      password: hashPassword,
      creation_date: Date.now(),
      wallet: {
        usd: 100,
        gbp: 100,
      },
    });
    await document.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (e) {
    console.error("Error in registerController", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return
    }

    const user = await users.findOne({ email });
    if (!user || !user.password) {
      res.status(401).json({ error: "Wrong email or password" });
      return
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ error: "Invalid email or password" });
      return
      }

      const { accessToken, refreshToken } = generateTokens(user._id as string);

      user.refreshToken = refreshToken;
      user.save();

      res.status(200).json({
        message: "Login successful",
        accessToken,
        refreshToken,
        user: { id: user._id, email: user.email },
      });
    }
  } catch (e) {
    console.error("Error in loginController", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

