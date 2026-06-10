import { MongoClient } from "mongodb";

const conString = "mongodb://127.0.0.1:27017";

const client = new MongoClient(conString);

let db = null;

export const connectDB = async () => {
  try {
    // Prevent multiple connections
    if (db) {
      return db;
    }

    await client.connect();

    console.log("✅ MongoDB Connected");

    db = client.db("fullstack-ems");

    return db;
  } catch (err) {
    console.error("❌ Connection Error:", err);

    throw err;
  }
};

export const getDB = () => {
  if (!db) {
    throw new Error("❌ DB not initialized. Call connectDB() first.");
  }

  return db;
};
