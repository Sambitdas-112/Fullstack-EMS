import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import "dotenv/config";
import { connectDB } from "./config/db.js";

const client = new MongoClient("mongodb://127.0.0.1:27017");

const ADMIN_EMAIL = "admin@gmail.com";

const TEMP_PASSWORD = "admin123";

async function registerAdmin() {
  try {
    await client.connect();

    const db = client.db("fullstack-ems");

    const usersCollection = db.collection("users");

    const existingAdmin = await usersCollection.findOne({
      email: ADMIN_EMAIL,
    });

    if (existingAdmin) {
      console.log("User already exists with role:", existingAdmin.role);

      return;
    }

    const hashedPassword = await bcrypt.hash(TEMP_PASSWORD, 10);

    await usersCollection.insertOne({
      email: ADMIN_EMAIL,

      password: hashedPassword,

      role: "admin",

      createdAt: new Date(),
    });

    console.log("✅ Admin Created");

    console.log("Email:", ADMIN_EMAIL);

    console.log("Password:", TEMP_PASSWORD);
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await client.close();
  }
}

registerAdmin();
