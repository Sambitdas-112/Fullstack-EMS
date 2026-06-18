import express from "express";
import cors from "cors";
import "dotenv/config";
import multer from "multer";

import authRouter from "./routes/auth-routes.js";
import attendanceRouter from "./routes/attendance-routes.js";
import employeesRouter from "./routes/employee-routes.js";
import profileRouter from "./routes/profile-routes.js";
import leaveRouter from "./routes/leave-router.js";
import payslipRouter from "./routes/payslip-routes.js";
import dashboardRouter from "./routes/dashboard-routes.js";

import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";

import { connectDB } from "./config/db.js";

const app = express();

const PORT = process.env.PORT || 6080;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(
  express.json({
    limit: "5mb",
  }),
);
app.use(multer().none());
app.use(express.urlencoded({ extended: true }));

// functions.forEach((fn, index) => {
//   console.log(`Function ${index + 1}:`, fn);
// });

app.use("/api/inngest", serve({ client: inngest, functions }));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/employees", employeesRouter);
app.use("/api/profile", profileRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/leave", leaveRouter);
app.use("/api/payslips", payslipRouter);
app.use("/api/dashboard", dashboardRouter);

// DB Connection
await connectDB();

// Test Route
app.get("/", (req, res) => {
  res.send("Backend Running");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
