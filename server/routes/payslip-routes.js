import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { createPayslip, getPayslipById, getPayslips } from "../controllers/payslip-controller.js";

const payslipRouter = Router();

payslipRouter.post("/", protect, createPayslip)
payslipRouter.get("/", protect, getPayslips)
payslipRouter.get("/:id", protect, getPayslipById)

export default payslipRouter