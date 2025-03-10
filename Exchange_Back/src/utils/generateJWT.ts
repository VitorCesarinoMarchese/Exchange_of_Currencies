import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateTokens = (userId: string) => {
    const jwtSecret = process.env.JWT_SECRET!;
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET!;

    if (!jwtSecret || !jwtRefreshSecret) {
        throw new Error("Missing JWT environment variables");
    }

    const accessToken = jwt.sign(
        { userId },
        jwtSecret,
        { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
        { userId },
        jwtRefreshSecret,
        { expiresIn: "7d"}
    );

    return { accessToken, refreshToken };
};
