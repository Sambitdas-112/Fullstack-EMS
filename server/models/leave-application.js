import { MongoClient } from "mongodb";
import { connectDB } from "./config/db.js";

const client = new MongoClient(process.env.MONGODB_URI)

export default async function LeaveApplication() {
  try {
    await client.connect();
    const db = client.db("fullstack-ems");

    await db.createCollection("leaveApplications", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: [
            "employeeId",
            "type",
            "startDate",
            "endDate",
            "reason"
          ],
          properties: {
            employeeId: {
              bsonType: "objectId",
              description: "Reference to Employee"
            },
            type: {
              enum: ["SICK", "CASUAL", "ANNUAL"]
            },
            startDate: {
              bsonType: "date"
            },
            endDate: {
              bsonType: "date"
            },
            reason: {
              bsonType: "string"
            },
            status: {
              enum: ["PENDING", "APPROVED", "REJECTED"]
            },
            createdAt: {
              bsonType: "date"
            },
            updatedAt: {
              bsonType: "date"
            }
          }
        }
      }
    });

    const collection = db.collection("leaveApplications");

    // Optional index for faster queries
    await collection.createIndex({ employeeId: 1 });

    console.log("LeaveApplication collection ready");

  } catch (err) {
    console.error(err);
  }
}