import { MongoClient } from "mongodb";
import { connectDB } from "./config/db.js";
import { DEPARTMENTS } from "../constants/departments.js";

const client = new MongoClient(process.env.MONGODB_URI)

export default async function Employee() {
  try {
    await client.connect();
    const db = client.db("fullstack-ems");

    await db.createCollection("employees", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: [
            "userId",
            "firstName",
            "lastName",
            "email",
            "phone",
            "position",
            "joinDate"
          ],
          properties: {
            userId: {
              bsonType: "objectId",
              description: "Reference to User"
            },
            firstName: {
              bsonType: "string"
            },
            lastName: {
              bsonType: "string"
            },
            email: {
              bsonType: "string"
            },
            phone: {
              bsonType: "string"
            },
            position: {
              bsonType: "string"
            },
            basicSalary: {
              bsonType: ["double", "int"],
              default: 0
            },
            allowances: {
              bsonType: ["double", "int"],
              default: 0
            },
            deductions: {
              bsonType: ["double", "int"],
              default: 0
            },
            employmentStatus: {
              enum: ["ACTIVE", "INACTIVE"]
            },
            joinDate: {
              bsonType: "date"
            },
            isDeleted: {
              bsonType: "bool"
            },
            bio: {
              bsonType: "string"
            },
            department: {
              enum: DEPARTMENTS
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

    const collection = db.collection("employees");

    // Unique index for userId (like your schema)
    await collection.createIndex({ userId: 1 }, { unique: true });

    // Optional: unique email
    await collection.createIndex({ email: 1 }, { unique: true });

    console.log("Employee collection ready");

  } catch (err) {
    console.error(err);
  }
}