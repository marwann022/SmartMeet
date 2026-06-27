import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smartmeet");
        console.log("Connected to MongoDB");

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        
        console.log("\nDocument counts in collections:");
        for (const col of collections) {
            const count = await db.collection(col.name).countDocuments();
            console.log(`- ${col.name}: ${count}`);
        }

        // Print Users
        const users = await db.collection("users").find({}).toArray();
        console.log("\nUsers in DB:");
        users.forEach(u => {
            console.log(`- ID: ${u._id}, Name: ${u.name}, Email: ${u.email}`);
        });

        // Print all meetings
        const meetings = await db.collection("meetings").find({}).toArray();
        console.log("\nAll Meetings in DB:");
        meetings.forEach(m => {
            console.log(`- ID: ${m._id}, Title: ${m.title}, Host: ${m.host}, Status: ${m.status}, Recording: ${m.recordingPath}`);
        });
    } catch (err) {
        console.error("Database status check failed:", err);
    } finally {
        await mongoose.disconnect();
    }
};

run();
