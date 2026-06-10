import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { createLeave, getLeaves, updateLeaveStatus } from "../controllers/leave-controller.js";

const leaveRouter = Router();

leaveRouter.post("/", protect, createLeave)
leaveRouter.get("/", protect, getLeaves)
leaveRouter.patch("/:id", protect, updateLeaveStatus)

export default leaveRouter;