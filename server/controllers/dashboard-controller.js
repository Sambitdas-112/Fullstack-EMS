import { connectDB } from "../config/db.js";
import { ObjectId } from "mongodb";
import { DEPARTMENTS } from "../constants/departments.js";

export const getDashboard = async (req, res) => {
  try {
    const db = await connectDB();
    const userId = req.user.userId;
    const role = req.user.role;

    // 📅 Today range (safe)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // ================= ADMIN =================
    if (role === "admin") {
      const [totalEmployees, todayAttendance, pendingLeaves] =
        await Promise.all([
          db.collection("employees").countDocuments({
            isDeleted: { $ne: true },
          }),
          

          db.collection("attendance").countDocuments({
            date: {
              $gte: startOfToday,
              $lte: endOfToday,
            },
          }),

          db.collection("leaveApplications").countDocuments({
            status: "PENDING",
          }),
        ]);

      return res.json({
        role: "admin",
        totalEmployees,
        totalDepartments: DEPARTMENTS.length,
        todayAttendance,
        pendingLeaves,
      });
    }

    // ================= EMPLOYEE =================
    
    const employee = await db.collection("employees").findOne({
       $or: [
    { userId: userId },
    { userId: new ObjectId(userId) },
  ],
    });

    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }

    const today = new Date();

    const startOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    const endOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1
    );

    const [currentMonthAttendance, pendingLeaves, latestPayslip] =
      await Promise.all([
        // ✅ FIXED: filter by employeeId
        db.collection("attendance").countDocuments({
          employeeId: employee._id,
          date: {
            $gte: startOfMonth,
            $lt: endOfMonth,
          },
        }),

        db.collection("leaveApplications").countDocuments({
          employeeId: employee._id,
          status: "PENDING",
        }),

        db.collection("payslips").find({ employeeId: employee._id }).sort({ createdAt: -1 }).limit(1).toArray(),
      ]);

    return res.json({
      role: "EMPLOYEE",
      employee: {
        ...employee,
        id: employee._id.toString(),
      },
      currentMonthAttendance,
      pendingLeaves,
      latestPayslip:
        latestPayslip.length > 0
          ? {
              ...latestPayslip[0],
              id: latestPayslip[0]._id.toString(),
            }
          : null,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    return res.status(500).json({
      error: "Failed to load dashboard",
    });
  }
};