import jwt from "jsonwebtoken"

export const validateToken = (token: string) => {
    try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!);
            decoded;
            return true
          } catch (error) {
            return false;
          }
}