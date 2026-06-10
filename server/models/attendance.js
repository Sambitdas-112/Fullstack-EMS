import { MongoClient } from "mongodb";
import { connectDB } from "./config/db.js";

const conString = "mongodb://127.0.0.1:27017";
const client = new MongoClient(conString);

export default async function Attendance() {
  try {
    await client.connect();
    const db = client.db("fullstack-ems"); // your database name

    // Create collection with validation (schema-like)
    await db.createCollection("attendance", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["employeeId", "date", "status"],
          properties: {
            employeeId: {
              bsonType: "objectId",
              description: "must be ObjectId and required"
            },
            date: {
              bsonType: "date",
              description: "must be a date"
            },
            checkIn: {
              bsonType: ["date", "null"]
            },
            checkOut: {
              bsonType: ["date", "null"]
            },
            status: {
              enum: ["PRESENT", "ABSENT", "LATE"],
              description: "can only be one of enum values"
            },
            workingHours: {
              bsonType: ["double", "int", "null"]
            },
            dayType: {
              enum: [
                "Full Day",
                "Three Quarters Day",
                "Half Day",
                "Short Day",
                null
              ]
            }
          }
        }
      }
    });

    const collection = db.collection("attendance");

    // Create unique index (same as your schema index)
    await collection.createIndex(
      { employeeId: 1, date: 1 },
      { unique: true }
    );

    console.log("Attendance collection ready");

  } catch (err) {
    console.error(err);
  }
}