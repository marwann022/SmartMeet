/**
 * seedTeam.js
 * ─────────────────────────────────────────────────────────────────
 * Adds 4 team members to the existing admin's community workspace.
 * The admin (marwanelgammal5@outlook.com) must already exist.
 *
 * Safe to run multiple times — no duplicates created.
 * New member passwords are hashed via the User model's pre-save bcrypt hook.
 *
 * Usage:
 *   node src/scripts/seedTeam.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Community from "../models/Community.js";

const ADMIN_EMAIL = "marwanelgammal5@outlook.com";

// ─── Members to seed (admin excluded — already exists) ────────────
const MEMBERS = [
    {
        firstName: "Ebrahim",
        lastName: "",
        name: "Ebrahim",
        email: "ebrahim@gmail.com",
        password: "Pass@12345",
        role: "user",
        jobTitle: "Backend Developer",
        company: "Backend",
    },
    {
        firstName: "Youssef",
        lastName: "",
        name: "Youssef",
        email: "youssef@gmail.com",
        password: "Pass@12345",
        role: "user",
        jobTitle: "Backend Developer",
        company: "Backend",
    },
    {
        firstName: "Zena",
        lastName: "",
        name: "Zena",
        email: "zena@gmail.com",
        password: "Pass@12345",
        role: "user",
        jobTitle: "UI/UX Designer",
        company: "UI/UX",
    },
    {
        firstName: "Hana",
        lastName: "",
        name: "Hana",
        email: "hana@gmail.com",
        password: "Pass@12345",
        role: "user",
        jobTitle: "Frontend Developer",
        company: "Front",
    },
];

// ─── Main ────────────────────────────────────────────────────────

const run = async () => {
    await connectDB();
    console.log("\n═══════════════════════════════════════════");
    console.log("🌱 SmartMeet — Team Seed Script");
    console.log("═══════════════════════════════════════════\n");

    // Step 1: Find the existing admin and resolve their community
    const admin = await User.findOne({ email: ADMIN_EMAIL });
    if (!admin) {
        console.error(`❌ Admin not found: ${ADMIN_EMAIL}`);
        console.error("   Please register the admin account first, then re-run this script.");
        process.exit(1);
    }

    let communityId = admin.community;
    let commDoc = communityId ? await Community.findById(communityId) : null;
    if (!commDoc) {
        const cryptoModule = await import("crypto");
        const code = "SM-" + cryptoModule.default.randomBytes(3).toString("hex").toUpperCase();
        commDoc = await Community.create({
            name: `${(admin.name || admin.firstName || "Admin").trim()}'s Community`,
            code,
            owner: admin._id,
        });
        communityId = commDoc._id;
        admin.community = communityId;
        await admin.save();
        console.log(`✓ Created new Community: ${commDoc.name} (${commDoc.code})`);
    }

    console.log(`✓ Found admin: ${admin.firstName} ${admin.lastName} (${admin.email})`);
    console.log(`✓ Community  : ${communityId}\n`);

    // Step 2: Upsert each member
    console.log("👤 Seeding team members...");
    const results = [];

    for (const data of MEMBERS) {
        const existing = await User.findOne({ email: data.email });

        if (existing) {
            // Already exists — just make sure community is linked and status is active
            await User.updateOne(
                { email: data.email },
                {
                    $set: {
                        community: communityId || existing.community,
                        status: "active",
                        role: data.role,
                        jobTitle: data.jobTitle,
                        company: data.company,
                    },
                }
            );
            console.log(`   ↺ Already exists — synced community: ${data.email}`);
            results.push({ email: data.email, action: "updated" });
            continue;
        }

        // New user — password hashed automatically by User model pre-save hook
        const user = new User({
            name: data.name,
            firstName: data.firstName,
            lastName: data.lastName || "",
            email: data.email,
            password: data.password,
            role: data.role,
            jobTitle: data.jobTitle,
            company: data.company,
            community: communityId || null,
            status: "active",
        });

        await user.save();
        console.log(`   ✓ Created: ${data.email} (${data.role})`);
        results.push({ email: data.email, action: "created" });
    }

    // Step 3: Summary
    const created = results.filter((r) => r.action === "created").length;
    const updated = results.filter((r) => r.action === "updated").length;

    console.log("\n═══════════════════════════════════════════");
    console.log(`✅ Done — ${created} created, ${updated} updated.`);
    console.log("\n📋 Full Team:");
    console.log(`   👑 Marwan Elgammal           ${ADMIN_EMAIL}  (admin — existing)`);
    for (const m of MEMBERS) {
        console.log(`   👤 ${m.name.padEnd(22)} ${m.email}`);
    }
    console.log("\n🔑 New member password: Pass@12345");
    if (communityId) console.log(`🏢 Community ID        : ${communityId}`);
    console.log("═══════════════════════════════════════════\n");

    await mongoose.disconnect();
};

run().catch(async (err) => {
    console.error("❌ Seed failed:", err.message);
    await mongoose.disconnect();
    process.exit(1);
});
