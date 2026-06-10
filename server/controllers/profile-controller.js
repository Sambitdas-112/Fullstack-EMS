import { connectDB } from "../config/db.js";
import { ObjectId } from "mongodb";

export const getProfile = async (req, res) => {
  try {
    const db = await connectDB();
    const userId = req.user.userId;
    const role = req.user.role;

    if (!req.user?.userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const employee = await db.collection("employees").findOne({
       userId: new ObjectId(req.user.userId),
    });

    // 👑 Admin fallback
    if (!employee) {

      const admin = await db.collection("users").findOne({
        _id: new ObjectId(req.user.userId),
      });
      
      return res.json({
        firstName: "Admin",
        lastName: "",
        email: admin?.email || "",
        role: req.user.role,
      });
    }

    return res.json({
      ...employee,
      id: employee._id.toString(),
      role: req.user.role,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch profile",
    });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const db = await connectDB();

    if (!req.user?.userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const employee = await db.collection("employees").findOne({
       userId: new ObjectId(req.user.userId),
    });

    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }

    if (employee.isDeleted) {
      return res.status(403).json({
        error:
          "Your account is deactivated. You cannot update your profile.",
      });
    }

    const { bio } = req.body;

    // ✅ Validation
    if (bio && bio.length > 500) {
      return res.status(400).json({
        error: "Bio must be under 500 characters",
      });
    }

    await db.collection("employees").updateOne(
      { _id: new ObjectId(employee._id) },
      {
        $set: {
          bio: bio || "",
          updatedAt: new Date(),
        },
      }
    );

    return res.json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to update profile",
    });
  }
};
