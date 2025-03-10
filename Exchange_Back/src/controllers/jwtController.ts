import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import users from "../models/user";
import conn from "../config/database";
import { validateToken } from "../utils/validateToken";

export const refreshTokenController = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ error: "Refresh token is required" });
    return
  }

  const user = await users.findOne({ refreshToken });
  if (!user) {
    res.status(403).json({ error: "Invalid refresh token" });
    return
  }

  try {
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
    if (!user) {
      res.status(403).json({ error: "User not found" });
      return
    } else {
      const accessToken = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "15m" }
      );

      res.json({ accessToken });
    }
  } catch (error) {
    console.error("Error in refreshTokenController", error);
    res.status(403).json({ error: "Invalid or expired refresh token" });
  }
};


export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization");
  if (!token) {
    res.status(403).json({ error: "Access denied" });
  } else {
    const isValid = validateToken(token as string)
    if(isValid){
      next();
    }else{
      res.status(403).json({ error: "Invalid or expired token" });
    }
  }
};
