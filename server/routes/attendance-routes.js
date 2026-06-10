import { Router } from "express";

import { clockInOut, getAttendance } from "../controllers/attendance-controller.js";
import { protect } from "../middleware/auth.js";

const attendanceRouter = Router();

attendanceRouter.get("/", protect, getAttendance)
attendanceRouter.post('/', protect, clockInOut)


export default attendanceRouter