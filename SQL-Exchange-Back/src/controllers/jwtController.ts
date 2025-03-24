import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import db from "../config/pgConfig";
import { validateToken } from "../utils/validateToken";

export const refreshTokenController = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ error: "Refresh token is required" });
    return;
  }

  const queryString = `SELECT * FROM users WHERE refreshToken = $1`;
  const user = (await db.query(queryString, [refreshToken]));
  if (user.rowCount == 0) {
    res.status(403).json({ error: "Invalid or expired refresh token" });
    return;
  }

  try {
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
    const accessToken = jwt.sign(
      { userId: user.rows[0].id, email: user.rows[0].email },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    res.status(200).json({ accessToken });
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
    return;
  } else {
    const isValid = validateToken(token as string);
    if (isValid) {
      next();
    } else {
      res.status(403).json({ error: "Invalid or expired token" });
      return;
    }
  }
};
