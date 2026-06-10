import { Router } from "express";
import {
  login,
  ChangePassword,
  session,
  
} from "../controllers/auth-controller.js";
import { protect } from "../middleware/auth.js";
import profileRouter from "./profile-routes.js";

const authRouter = Router();

// 🔐 Login
authRouter.post("/login", login);

// 👤 Get logged-in user/session
authRouter.get("/session", protect, session);

// 🔑 Change password
authRouter.post("/change-password", protect, ChangePassword);

export default authRouter;