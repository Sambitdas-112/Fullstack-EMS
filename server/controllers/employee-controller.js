import { connectDB } from "../config/db.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

export const getEmployee = async (req, res) => {
  try {
    const db = await connectDB();
    const { department } = req.query;

    // Mark as deleted
    const query = {};
    if (department) query.department = department;

    // Remove deleted employee
    // const query = {
    // isDeleted: { $ne: true },
    // };

    // if (department) {
    //   query.department = department;
    // }

    const employees = await db
      .collection("employees")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    // 🔗 Manual "populate"
    const userIds = employees.map((e) => e.userId);

    const users = await db
      .collection("users")
      .find({ _id: { $in: userIds } })
      .toArray();

    const userMap = {};
    users.forEach((u) => {
      userMap[u._id.toString()] = u;
    });

    const result = employees.map((emp) => ({
      ...emp,
      id: emp._id.toString(),
      user: userMap[emp.userId?.toString()]
        ? {
            email: userMap[emp.userId.toString()].email,
            role: userMap[emp.userId.toString()].role,
          }
        : null,
    }));

    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to fetch employees",
    });
  }
};

export const createEmployee = async (req, res) => {
  console.log("createEmployee", req.body);
  try {
    const db = await connectDB();

    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      department,
      basicSalary,
      allowances,
      deductions,
      joinDate,
      password,
      role,
      bio,
    } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const existingUser = await db.collection("users").findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: "Email already exists",
      });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 👤 Create user
    const userResult = await db.collection("users").insertOne({
      email,
      password: hashedPassword,
      role: role || "employee",
      createdAt: new Date(),
    });

    // 👨‍💼 Create employee
    const employee = {
      userId: userResult.insertedId,
      firstName,
      lastName,
      email,
      phone,
      position,
      department: department || "Engineering",
      basicSalary: Number(basicSalary) || 0,
      allowances: Number(allowances) || 0,
      deductions: Number(deductions) || 0,
       
      bio: bio || "",
      joinDate: new Date(joinDate),
      createdAt: new Date(),
    };

    const empResult = await db.collection("employees").insertOne(employee);

    return res.status(201).json({
      success: true,
      employee: {
        ...employee,
        _id: empResult.insertedId,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        error: "Email already exists",
      });
    }

    console.error(error);
    return res.status(500).json({
      error: "Failed to create employee",
    });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;

    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      department,
      basicSalary,
      allowances,
      deductions,
      joinDate,
      password,
      role,
      bio,
      employmentStatus,
    } = req.body;

    // Update object
    const updateData = {
      firstName,
      lastName,
      email,
      phone: phone || "",
      position: position || "",
      department: department || "Engineering",
      basicSalary: Number(basicSalary) || 0,
      allowances: Number(allowances) || 0,
      deductions: Number(deductions) || 0,
      employmentStatus: employmentStatus || "ACTIVE",
      bio: bio || "",
      joinDate: joinDate ? new Date(joinDate) : new Date(),
      updatedAt: new Date(),
    };

    // Remove undefined fields
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    // Update employee
    const result = await db.collection("employees").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: updateData,
      },
    );

    // Update user collection if needed
    if (email || password || role) {
      const userUpdateData = {};

      if (email) {
        userUpdateData.email = email;
      }

      if (role) {
        userUpdateData.role = role;
      }

      if (password) {
        userUpdateData.password = await bcrypt.hash(password, 10);
      }

      await db.collection("users").updateOne(
        { _id: new ObjectId(id) },
        {
          $set: userUpdateData,
        },
      );
    }

    if (result.matchedCount === 0) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }

    return res.json({
      success: true,
      message: "Employee updated successfully",
    });
  } catch (error) {
    console.error("Update employee error:", error);

    return res.status(500).json({
      error: "Failed to update employee",
    });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;

    const result = await db.collection("employees").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          isDeleted: true,
          employmentStatus: "INACTIVE",
        },
      },
    );

    if (!result.matchedCount) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to delete employee",
    });
  }
};
