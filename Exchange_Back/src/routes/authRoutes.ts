import { Request, Response, Router } from "express";
import { loginController, registerController } from "../controllers/authController";
import { refreshTokenController, verifyToken } from "../controllers/jwtController";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/refresh-token", refreshTokenController);
router.get("/profile", verifyToken, (req: Request, res: Response) => {
    res.status(200).json({ message: "Profile accessed", user: req.body.user });
});


export default router;
