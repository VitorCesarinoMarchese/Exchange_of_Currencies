import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import users from "../models/user";
dotenv.config();

export const generateTokens = async (user_id: string) => {
    const jwtSecret = process.env.JWT_SECRET!;
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET!;
    
    const user = await users.findOne({ _id: String(user_id) });
    if(!user){
        return {error: "User not found"}
    }
    if (!jwtSecret || !jwtRefreshSecret) {
        throw new Error("Missing JWT environment variables");
    }

    const accessToken = jwt.sign(
        { user_id },
        jwtSecret,
        { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
        { user_id },
        jwtRefreshSecret,
        { expiresIn: "7d"}
    );

    return { accessToken, refreshToken };
};
