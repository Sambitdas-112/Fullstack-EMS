import { connectDB } from "../config/db.js";
import { ObjectId } from "mongodb";
import { inngest } from "../inngest/index.js";

export const clockInOut = async (req, res) => {
  try {
    const db = await connectDB();
     const userId = req.user.userId;

    // 🔍 Find employee
    const employee = await db.collection("employees").findOne({
     userId: new ObjectId(req.user.userId),
    });
    
    if (!employee)
      return res.status(404).json({ error: "Employee not found" });

    if (employee.isDeleted)
      return res.status(403).json({
        error: "Your account is deactivated. You cannot in/out",
      });

    // 📅 Start of today
    const today = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    today.setHours(0, 0, 0, 0);
    

    // 🔍 Check existing attendance
    const existing = await db.collection("attendance").findOne({
      employeeId: employee._id,
      date: today,
    });

    const now = new Date();

    // ✅ CHECK-IN
    if (!existing) {
      const isLate = now.getHours() >= 9 && now.getMinutes() > 0;

      const newAttendance = {
        employeeId: employee._id,
        date: today,
        checkIn: now,
        status: isLate ? "LATE" : "PRESENT",
      };
      
      const result = await db.collection("attendance").insertOne(newAttendance);

      await inngest.send({
        name: "employee/check-out",
        data: {
          employeeId: employee._id,
          attendanceId: result.insertedId,
        }
      })

      return res.json({
        success: true,
        type: "CHECK_IN",
        data: { _id: result.insertedId, ...newAttendance },
      });
    }

    // ✅ CHECK-OUT
    if (!existing.checkOut) {
      const checkInTime = new Date(existing.checkIn).getTime();
      const diffMS = now.getTime() - checkInTime;
      const diffHours = diffMS / (1000 * 60 * 60);

      const workingHours = parseFloat(diffHours.toFixed(2));

      let dayType = "Short Day";
      if (workingHours >= 8) dayType = "Full Day";
      else if (workingHours >= 6) dayType = "Three Quarter Day";
      else if (workingHours >= 4) dayType = "Half Day";

      await db.collection("attendance").updateOne(
        { _id: existing._id },
        {
          $set: {
            checkOut: now,
            workingHours,
            dayType,
          },
        }
      );

      return res.json({
        success: true,
        type: "CHECK_OUT",
      });
    }

    // ✅ Already checked out
    return res.json({
      success: true,
      type: "CHECK_OUT",
      data: existing,
    });
  } catch (error) {
    console.error("Attendance Error:", error);
    return res.status(500).json({ error: "Operation Failed" });
  }
};


export const getAttendance = async (req, res) => {
  try {
    const db = await connectDB();
  
    const employee = await db.collection("employees").findOne({
      userId: new ObjectId(req.user.userId),
    });
    console.log("employee:", employee);

    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }
    
    const limit = parseInt(req.query.limit || 30);

    const history = await db.collection("attendance")
      .find({ employeeId: employee._id })
      .sort({ date: -1 })
      .limit(limit)
      .toArray();

    return res.json({
      data: history,
      employee: {
        isDeleted: employee.isDeleted,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to fetch attendance",
    });
  }
};