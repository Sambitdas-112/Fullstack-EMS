import { connectDB } from "../config/db.js";
import { ObjectId } from "mongodb";
import { inngest } from "../inngest/index.js";

export const createLeave = async (req, res) => {
  try {
    const db = await connectDB();
  
    if (!req.user?.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 🔍 Find employee
    const employee = await db.collection("employees").findOne({
      userId: new ObjectId(req.user.userId),
    });

    if (!employee) {
      return res.status(404).json({
        error: `Employee not found for userId: ${req.user.userId}`,
      });
    }

    if (employee.isDeleted) {
      return res.status(403).json({
        error:
          "Your account is deactivated. You cannot apply for leave.",
      });
    }

    const { type, startDate, endDate, reason } = req.body;

    if (!type || !startDate || !endDate || !reason) {
      return res.status(400).json({
        error: "Missing fields",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ✅ Correct validations
    if (start < today || end < today) {
      return res.status(400).json({
        error: "Leave must be in the future",
      });
    }

    if (end < start) {
      return res.status(400).json({
        error: "End date cannot be before start date",
      });
    }

    const leave = {
      employeeId: employee._id,
      type,
      startDate: start,
      endDate: end,
      reason,
      status: "PENDING",
      createdAt: new Date(),
    };

    const result = await db.collection("leaveApplications").insertOne(leave);
    
    await inngest.send({
      name: "leave/pending",
      data: {leaveApplicationId: result.insertedId,}
    })


    return res.json({
      success: true,
      data: { _id: result.insertedId, ...leave },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to create leave",
    });
  }
};


export const getLeaves = async (req, res) => {
  try {
    const db = await connectDB();
    

     if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const isAdmin = req.user.role === "admin";

    // ✅ ADMIN: see all leaves + employee details
    if (isAdmin) {
      const status = req.query.status;

      const match = status ? { status } : {};

      const leaves = await db.collection("leaveApplications")
        .aggregate([
          { $match: match },
          {
            $lookup: {
              from: "employees",
              localField: "employeeId",
              foreignField: "_id",
              as: "employee"
            }
          },
          { $unwind: "$employee" },
          { $sort: { createdAt: -1 } }
        ])
        .toArray();

      return res.json({ data: leaves });
    }

    // ✅ EMPLOYEE: own leaves only
    const employee = await db.collection("employees").findOne({
      userId: new ObjectId(req.user.userId)
    });

    if (!employee)
      return res.status(404).json({ error: "Not found" });

    const leaves = await db.collection("leaveApplications")
      .find({ employeeId: employee._id })
      .sort({ createdAt: -1 })
      .toArray();

    return res.json({
      data: leaves,
      employee
    });

  } catch (error) {
    return res.status(500).json({ error: "Failed" });
  }
};


export const updateLeaveStatus = async (req, res) => {
  try {
    const db =  await connectDB();

    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Admin access required"
      });
    }

    const { status } = req.body;

    if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const result = await db.collection("leaveApplications").findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          status,
          updatedAt: new Date()
        }
      },
      { returnDocument: "after" }
    );

    return res.json({
      success: true,
      data: result.value
    });

  } catch (error) {
    return res.status(500).json({ error: "Failed" });
  }
};