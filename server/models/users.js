import { MongoClient } from "mongodb";
import { connectDB } from "../config/db.js";

const conString = "mongodb://127.0.0.1:27017";
const client = new MongoClient(conString);

export default async function User() {
  try {
    await client.connect();
    const db = client.db("fullstack-ems");

    await db.createCollection("users", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["email", "password"],
          properties: {
            email: {
              bsonType: "string",
              description: "must be a string and required"
            },
            password: {
              bsonType: "string",
              description: "must be a string and required"
            },
            role: {
              enum: ["admin", "EMPLOYEE"]
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

    const collection = db.collection("users");

    // Unique email constraint
    await collection.createIndex({ email: 1 }, { unique: true });

    console.log("User collection ready");

  } catch (err) {
    console.error(err);
  }
  
}