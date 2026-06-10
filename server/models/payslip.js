import { MongoClient } from "mongodb";
import { connectDB } from "../config/db.js";

const conString = "mongodb://127.0.0.1:27017";
const client = new MongoClient(conString);

export default async function Payslip() {
  try {
    await client.connect();
    const db = client.db("fullstack-ems");

    await db.createCollection("payslips", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: [
            "employeeId",
            "month",
            "year",
            "basicSalary",
            "netSalary"
          ],
          properties: {
            employeeId: {
              bsonType: "objectId"
            },
            month: {
              bsonType: "int",
              minimum: 1,
              maximum: 12
            },
            year: {
              bsonType: "int"
            },
            basicSalary: {
              bsonType: ["double", "int"]
            },
            allowances: {
              bsonType: ["double", "int"]
            },
            deductions: {
              bsonType: ["double", "int"]
            },
            netSalary: {
              bsonType: ["double", "int"]
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

    const collection = db.collection("payslips");

    // Prevent duplicate payslip for same employee/month/year
    await collection.createIndex(
      { employeeId: 1, month: 1, year: 1 },
      { unique: true }
    );

    console.log("Payslip collection ready");

  } catch (err) {
    console.error(err);
  }
}