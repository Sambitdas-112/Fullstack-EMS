import { connectDB } from "../config/db.js";
import { ObjectId } from "mongodb";
import { inngest } from "../inngest/index.js";

export const clockInOut = async (req, res) => {
  try {
    const db = await connectDB();
    const userId = req.user.userId;

    // Find employee
    const employee = await db.collection("employees").findOne({
      userId: new ObjectId(userId),
    });

    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }

    if (employee.isDeleted) {
      return res.status(403).json({
        error: "Your account is deactivated. You cannot check in/out",
      });
    }

    // Start of today (IST)
    const today = new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      })
    );

    today.setHours(0, 0, 0, 0);

    // Existing attendance
    const existing = await db.collection("attendance").findOne({
      employeeId: employee._id,
      date: today,
    });

    const now = new Date();

    // ======================================================
    // CHECK IN
    // ======================================================
    if (!existing) {
      const isLate = now.getHours() >= 9 && now.getMinutes() > 0;

      const newAttendance = {
        employeeId: employee._id,
        date: today,
        checkIn: now,
        status: isLate ? "LATE" : "PRESENT",
        createdAt: new Date(),
      };

      const result = await db.collection("attendance").insertOne(newAttendance);

      // Send Inngest event
      try {
        console.log("🚀 About to send Inngest event");

        const response = await inngest.send({
          name: "employee/check-in",
          data: {
            employeeId: employee._id.toString(),
            attendanceId: result.insertedId.toString(),
          },
        });

        console.log("✅ Event sent successfully");
        console.log(response);
      } catch (err) {
        console.error("❌ Event send failed");
        console.error(err);
      }

      return res.json({
        success: true,
        type: "CHECK_IN",
        data: {
          _id: result.insertedId,
          ...newAttendance,
        },
      });
    }

    // ======================================================
    // CHECK OUT
    // ======================================================
    if (!existing.checkOut) {
      const checkInTime = new Date(existing.checkIn).getTime();

      const diffMS = now.getTime() - checkInTime;
      const diffHours = diffMS / (1000 * 60 * 60);

      const workingHours = Number(diffHours.toFixed(2));

      let dayType = "SHORT_DAY";

      if (workingHours >= 8) {
        dayType = "FULL_DAY";
      } else if (workingHours >= 6) {
        dayType = "THREE_QUARTER_DAY";
      } else if (workingHours >= 4) {
        dayType = "HALF_DAY";
      }

      await db.collection("attendance").updateOne(
        {
          _id: existing._id,
        },
        {
          $set: {
            checkOut: now,
            workingHours,
            dayType,
            updatedAt: new Date(),
          },
        }
      );

      return res.json({
        success: true,
        type: "CHECK_OUT",
      });
    }

    // Already checked out
    return res.json({
      success: true,
      type: "ALREADY_CHECKED_OUT",
      data: existing,
    });
  } catch (error) {
    console.error("Attendance Error:", error);

    return res.status(500).json({
      error: "Operation Failed",
    });
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