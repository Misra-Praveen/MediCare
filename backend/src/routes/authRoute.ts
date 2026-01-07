import { Router } from "express";
import { getUserDetails, login, register } from "../controllers/UserController";
import protect from "../middleware/authMiddleware";

const authRouter = Router();

authRouter.post("/sign-up", register);
authRouter.post("/sign-in", login)
authRouter.get("/user/me",protect, getUserDetails)

export default authRouter;