import { connectDB } from "../config/db.js";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

// ================= SESSION =================

export const session = async (req, res) => {
  try {
    const db = await connectDB();

    // use req.user from protect middleware
    const user = await db.collection("users").findOne({
      _id: new ObjectId(req.user.userId),
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.json({
      user: {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Session failed",
    });
  }
};

// ================= PROTECT =================

export const protect = async (req, res, next) => {
  
  try {
    const authHeader = req.headers.authorization;
    console.log("AUTH HEADER:", req.headers.authorization);

    // Check header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];
    console.log("TOKEN:", token);


    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED", decoded);

    // Attach user
    req.user = decoded;

    next();
  } catch (error) {
    console.error("JWT ERROR:", error.message);

    return res.status(401).json({
      error: "Invalid token",
    });
  }
};

export const protectAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      error: "Admin access required",
    });
  }

  next();
};
