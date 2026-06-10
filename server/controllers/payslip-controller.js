import { connectDB } from "../config/db.js";
import { ObjectId } from "mongodb";

export const createPayslip = async (req, res) => {
  
  try {
    const db = await connectDB();
    
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Admin access required",
      });
    }

    const {
      employeeId,
      month,
      year,
      basicSalary,
      allowances = 0,
      deductions = 0,
    } = req.body;

    if (!employeeId || !month || !year || !basicSalary) {
      return res.status(400).json({
        error: "Missing fields",
      });
    }

    const empId = new ObjectId(employeeId);

    // 🚫 Prevent duplicate payslip (VERY IMPORTANT)
    const existing = await db.collection("payslips").findOne({
      employeeId: empId,
      month: Number(month),
      year: Number(year),
    });

    if (existing) {
      return res.status(400).json({
        error: "Payslip already exists for this month",
      });
    }

    const netSalary = Number(basicSalary) + Number(allowances) - Number(deductions);

    const payslip = {
      employeeId: empId,
      month: Number(month),
      year: Number(year),
      basicSalary: Number(basicSalary),
      allowances: Number(allowances),
      deductions: Number(deductions),
      netSalary,
      createdAt: new Date(),
    };

    const result = await db.collection("payslips").insertOne(payslip);

    return res.json({
      success: true,
      data: { _id: result.insertedId, ...payslip },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to create payslip",
    });
  }
};



export const getPayslips = async (req, res) => {
  try {
    const db = await connectDB();

    if (!req.user?.userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const isAdmin = req.user.role === "admin";

    // ================= ADMIN =================
    if (isAdmin) {
      const payslips = await db
        .collection("payslips")
        .find()
        .sort({ createdAt: -1 })
        .toArray();

      // 🔗 Manual populate
      const employeeIds = payslips.map((p) => p.employeeId);

      const employees = await db
        .collection("employees")
        .find({ _id: { $in: employeeIds } })
        .toArray();

      const empMap = {};
      employees.forEach((e) => {
        empMap[e._id.toString()] = e;
      });

      const data = payslips.map((p) => ({
        ...p,
        id: p._id.toString(),
        employee: empMap[p.employeeId?.toString()] || null,
        employeeId: p.employeeId?.toString(),
      }));

      return res.json({ data });
    }

    // ================= EMPLOYEE =================

    const employee = await db.collection("employees").findOne({
      userId: new ObjectId(req.user.userId),
    });

    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }

    const payslips = await db
      .collection("payslips")
      .find({ employeeId: employee._id })
      .sort({ createdAt: -1 })
      .toArray();

    return res.json({
      data: payslips.map((p) => ({
        ...p,
        id: p._id.toString(),
      })),
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch payslips",
    });
  }
};


export const getPayslipById = async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;

    const payslip = await db.collection("payslips").findOne({
      _id: new ObjectId(id),
    });

    if (!payslip) {
      return res.status(404).json({
        error: "Payslip not found",
      });
    }

    // 🔗 Get employee
    const employee = await db.collection("employees").findOne({
      _id: payslip.employeeId,
    });

    return res.json({
      ...payslip,
      id: payslip._id.toString(),
      employee,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch payslip",
    });
  }
};