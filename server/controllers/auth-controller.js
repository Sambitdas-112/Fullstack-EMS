import { connectDB } from "../config/db.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const db = await connectDB();
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const user = await db.collection("users").findOne({ email: email });
    console.log("user", user);
    if (!user) {
      return res.status(401).json({
        error: "User not found",
      });
    }

    // After delete employee can't access the account
    const employee = await db.collection("employees").findOne({
      userId: user._id,
    });

    if (employee && employee.isDeleted === true) {
      return res.status(403).json({
        error: "Access denied. Your account has been deactivated. Please contact the administrator for assistance.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    if (role === "admin" && user.role !== "admin") {
      return res.status(403).json({
        error: "Not authorized as admin",
      });
    }

    // JWT payload
    const payload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    // Generate token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    return res.json({ token, user: payload });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Login failed",
    });
  }
};

export const session = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    // console.log("AUTH HEADER:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return res.json({
      user: decoded,
    });
  } catch (error) {
    console.error("SESSION ERROR:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token expired",
      });
    }

    return res.status(401).json({
      error: "Invalid token",
    });
  }
};


export const ChangePassword = async (req, res) => {
  try {
    const db = await connectDB();

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    const user = await db.collection("users").findOne({
      _id: new ObjectId(req.user.userId),
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        error: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await db.collection("users").updateOne(
      {
        _id: user._id,
      },
      {
        $set: {
          password: hashedPassword,
        },
      },
    );

    return res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Password change failed",
    });
  }
};
