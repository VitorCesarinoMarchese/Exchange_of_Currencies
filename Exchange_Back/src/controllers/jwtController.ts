import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import users from "../models/user";
import conn from "../config/database";

export const refreshTokenController = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ error: "Refresh token is required" });
  }

  const user = await users.findOne({ refreshToken });
  if (!user) {
    res.status(403).json({ error: "Invalid refresh token" });
  }

  try {
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
    if (!user) {
      res.status(403).json({ error: "User not found" });
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

interface AuthenticatedRequest extends Request {
    user?: any;
}

export const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization");
  if (!token) {
    res.status(403).json({ error: "Access denied" });
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(403).json({ error: "Invalid or expired token" });
    }
  }
};
