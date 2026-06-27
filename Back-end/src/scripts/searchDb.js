import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smartmeet");
        console.log("Connected to MongoDB");

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log("Collections in DB:", collections.map(c => c.name));

        for (const col of collections) {
            const data = await db.collection(col.name).find({}).toArray();
            const found = data.filter(doc => JSON.stringify(doc).includes("Arabic Test"));
            if (found.length > 0) {
                console.log(`\nFound in collection: ${col.name}`);
                found.forEach(doc => {
                    console.log(JSON.stringify(doc, null, 2));
                });
            }
        }
    } catch (err) {
        console.error("Search failed:", err);
    } finally {
        await mongoose.disconnect();
    }
};

run();
