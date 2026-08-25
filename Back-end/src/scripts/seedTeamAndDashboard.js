/**
 * seedTeamAndDashboard.js
 * ─────────────────────────────────────────────────────────────────
 * Master seed script for SmartMeet platform.
 * Populates:
 *   1. Admin account & Community workspace
 *   2. Team members (Ebrahim, Youssef, Zena, Hana, Sarah)
 *   3. Detailed Meetings with full Knowledge Base & Transcripts
 *   4. ActionItems linked to meetings & assigned to members
 *   5. Tasks with historical & upcoming dates for Dashboard Stats,
 *      Activity Charts, and AI Insights.
 *
 * Safe to run multiple times (idempotent).
 *
 * Usage:
 *   node src/scripts/seedTeamAndDashboard.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import crypto from "crypto";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Community from "../models/Community.js";
import Meeting from "../models/Meeting.js";
import MeetingTranscript from "../models/MeetingTranscript.js";
import MeetingKnowledge from "../models/MeetingKnowledge.js";
import ActionItem from "../models/ActionItem.js";
import Task from "../models/Task.js";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "marwanelgammal5@outlook.com";
const DEFAULT_PASSWORD = "Pass@12345";

const generateMeetingId = () => crypto.randomBytes(12).toString("hex");

// ─── Team Members Definition ────────────────────────────────────────────────
const TEAM_MEMBERS = [
    {
        firstName: "Ebrahim",
        lastName: "Hassan",
        name: "Ebrahim Hassan",
        email: "ebrahim@gmail.com",
        jobTitle: "Backend Developer",
        company: "SmartMeet",
        avatarColor: "bg-blue-500",
    },
    {
        firstName: "Youssef",
        lastName: "Ahmed",
        name: "Youssef Ahmed",
        email: "youssef@gmail.com",
        jobTitle: "Backend Developer",
        company: "SmartMeet",
        avatarColor: "bg-emerald-500",
    },
    {
        firstName: "Zena",
        lastName: "Elsayed",
        name: "Zena Elsayed",
        email: "zena@gmail.com",
        jobTitle: "UI/UX Designer",
        company: "SmartMeet",
        avatarColor: "bg-purple-500",
    },
    {
        firstName: "Hana",
        lastName: "Mahmoud",
        name: "Hana Mahmoud",
        email: "hana@gmail.com",
        jobTitle: "Frontend Developer",
        company: "SmartMeet",
        avatarColor: "bg-amber-500",
    },
    {
        firstName: "Sarah",
        lastName: "Jenkins",
        name: "Sarah Jenkins",
        email: "sarah@gmail.com",
        jobTitle: "QA & DevOps Lead",
        company: "SmartMeet",
        avatarColor: "bg-rose-500",
    },
];

// ─── Meetings & Knowledge Dataset ──────────────────────────────────────────
const MEETINGS_DATA = [
    {
        title: "SmartMeet Project Kickoff & UI/UX Alignment",
        description: "Initial scope definition for SmartMeet SaaS, design system review, and Figma wireframe walkthrough.",
        daysAgo: 14,
        duration: 45,
        type: "Team",
        participantEmails: ["zena@gmail.com", "hana@gmail.com"],
        transcript: `[00:00] Marwan Elgammal: Good morning team. Today we're kicking off SmartMeet officially. Let's align on scope and design direction.
[00:10] Zena Elsayed: I've prepared the initial Figma wireframes for the landing page and dashboard. The design system is built around a clean dark mode palette.
[00:25] Marwan Elgammal: Excellent. Zena, can you present the color tokens and component variants?
[00:30] Zena Elsayed: Sure. The primary color is a deep indigo at #4B68FF and we have a complete slate-based dark surface system.
[01:00] Hana Mahmoud: Love it. I'll initialize the Vue 3 repo this week and set up Tailwind so the tokens are ready to consume.
[01:10] Marwan Elgammal: Perfect. Let's approve the dark mode palette officially and set our first deliverables.
[01:20] Zena Elsayed: Finalized mockups for TaskCard.vue by end of week — that works for me.
[01:30] Hana Mahmoud: Vue 3 repo initialized with layout components confirmed.`,
        summary: "Defined initial scope for the SmartMeet SaaS platform. Zena presented the foundational design system and initial Figma wireframes for the landing page and user dashboard. The team approved the dark mode color palette and set first sprint deliverables.",
        meetingOverview: "Kickoff session establishing SmartMeet's design foundations, technology stack alignment, and first actionable milestones for the UI/UX and frontend teams.",
        topics: ["Project Kickoff", "Design System", "Dark Mode Palette", "Figma Wireframes", "Vue 3 Setup"],
        decisions: [
            { text: "Approved dark mode palette (#4B68FF primary, slate surfaces) for user profile and dashboard interfaces.", confidence: 0.97 }
        ],
        actionItems: [
            { title: "Finalize high-fidelity mockups for TaskCard.vue", assignedTo: "Zena Elsayed", priority: "high", daysOffset: -10 },
            { title: "Initialize Vue 3 repository with Tailwind CSS", assignedTo: "Hana Mahmoud", priority: "high", daysOffset: -8 }
        ]
    },
    {
        title: "Backend Architecture & Database Schema Design",
        description: "Node.js/MongoDB architecture planning, Mongoose schema finalization, and AI pipeline integration hooks.",
        daysAgo: 10,
        duration: 60,
        type: "Team",
        participantEmails: ["ebrahim@gmail.com", "youssef@gmail.com"],
        transcript: `[00:00] Marwan Elgammal: Let me walk through the backend architecture. We're using Express 5 and MongoDB Mongoose.
[00:15] Ebrahim Hassan: I've drafted the middleware stack — JWT auth, role guards, and community scoping layer.
[00:30] Youssef Ahmed: I've prepared the initial Mongoose schemas for User, Meeting, Task, and ActionItem.
[00:45] Marwan Elgammal: Good. Let's discuss the AI vector pipeline. We need hooks so that after a meeting is processed, embeddings go into ChromaDB/Pinecone.
[01:00] Youssef Ahmed: I'll set up the MongoDB connection layer and deploy the schemas to Atlas this week.
[01:10] Ebrahim Hassan: I'll build the auth middleware and base routing layer.`,
        summary: "Outlined backend architecture using Node.js and MongoDB. Finalized schemas for User, Meeting, Task, and ActionItem models. Discussed integration hooks for the AI vector storage pipeline.",
        meetingOverview: "Technical design session establishing backend architecture, Mongoose ODM selection, and implementation milestones for auth and database layers.",
        topics: ["Backend Architecture", "Mongoose ODM", "Database Schemas", "Auth Middleware", "Vector Storage Hooks"],
        decisions: [
            { text: "Chose Mongoose as ODM and agreed to enforce strict Date validations for all deadline fields.", confidence: 0.98 }
        ],
        actionItems: [
            { title: "Build authMiddleware and standard base routing layer", assignedTo: "Ebrahim Hassan", priority: "high", daysOffset: -6 },
            { title: "Set up MongoDB connection layer and deploy initial model schemas", assignedTo: "Youssef Ahmed", priority: "high", daysOffset: -6 }
        ]
    },
    {
        title: "Frontend Component & Layout Implementation",
        description: "Authenticated layout skeleton review, sidebar configuration, and task dashboard component design decisions.",
        daysAgo: 7,
        duration: 45,
        type: "Team",
        participantEmails: ["hana@gmail.com", "zena@gmail.com"],
        transcript: `[00:00] Marwan Elgammal: Today Hana is walking us through the authenticated layout skeleton.
[00:10] Hana Mahmoud: Here's the main layout — sidebar on the left, top nav bar with notification bell, and main content area.
[00:25] Zena Elsayed: The sidebar icons match the Figma spec cleanly. Spacing looks great.
[00:40] Marwan Elgammal: Looks great. Grouping tasks by priority in the default dashboard view is confirmed.
[01:00] Hana Mahmoud: I'll start building out the TaskCard and DashboardTasks components after this.`,
        summary: "Hana demonstrated the authenticated layout skeleton and sidebar configuration. Zena verified alignment with UX design specs. Team agreed on default dashboard grouping behavior.",
        meetingOverview: "Frontend implementation sync reviewing layout architecture, component hierarchy, and dashboard configuration decisions.",
        topics: ["Authenticated Layout", "Sidebar Navigation", "TaskCard Component", "Dashboard Priority Grouping"],
        decisions: [
            { text: "Fixed default views for task dashboard to group by priority metrics rather than raw completion tags.", confidence: 0.96 }
        ],
        actionItems: [
            { title: "Construct TaskCard and DashboardTasks base components", assignedTo: "Hana Mahmoud", priority: "high", daysOffset: -3 },
            { title: "Export SVG icon assets and branding files", assignedTo: "Zena Elsayed", priority: "medium", daysOffset: -4 }
        ]
    },
    {
        title: "AI Pipeline & RAG System Architecture Review",
        description: "Evaluating Groq vs OpenAI model performance for meeting transcription summaries and vector search chunking.",
        daysAgo: 3,
        duration: 50,
        type: "Brainstorm",
        participantEmails: ["ebrahim@gmail.com", "sarah@gmail.com"],
        transcript: `[00:00] Marwan Elgammal: Welcome team. Today we review the RAG system architecture and AI summarization pipeline.
[00:15] Ebrahim Hassan: We integrated Groq Llama 3.3 for transcript processing. Analysis latency is under 3 seconds per meeting.
[00:30] Sarah Jenkins: For vector search, we're generating chunk embeddings using Xenova Transformers locally or OpenAI text-embedding-3-small.
[00:45] Marwan Elgammal: Excellent. Let's make sure meeting transcript chunks store start/end character offsets for precise UI citations.
[01:00] Ebrahim Hassan: Will implement character offset tracking in storeTranscriptLayer.`,
        summary: "Reviewed AI summarization and retrieval-augmented generation (RAG) architecture. Confirmed Groq Llama 3.3 for high-speed analysis and Xenova/OpenAI for vector embedding generation.",
        meetingOverview: "AI pipeline review establishing latency targets, embedding models, and transcript citation indexing.",
        topics: ["AI Summarization", "Groq Llama 3.3", "RAG System", "Vector Embeddings", "Transcript Citation"],
        decisions: [
            { text: "Adopted Groq Llama 3.3 70B as primary AI summarization engine for fast turnaround.", confidence: 0.99 }
        ],
        actionItems: [
            { title: "Add character offset tracking to transcript chunking service", assignedTo: "Ebrahim Hassan", priority: "high", daysOffset: 1 },
            { title: "Benchmark vector retrieval accuracy on 50 sample meeting queries", assignedTo: "Sarah Jenkins", priority: "medium", daysOffset: 2 }
        ]
    },
    {
        title: "Q3 Security Audit & Auth Refactoring",
        description: "Reviewing 2FA TOTP flow, JWT refresh token rotation, and community route authorization guards.",
        daysAgo: 1,
        duration: 40,
        type: "Standup",
        participantEmails: ["youssef@gmail.com", "sarah@gmail.com"],
        transcript: `[00:00] Marwan Elgammal: Let's do a quick security audit sync.
[00:10] Sarah Jenkins: I audited our JWT endpoints. We need to verify that decoded users exist in DB before proceeding in authMiddleware.
[00:25] Youssef Ahmed: Added speakeasy TOTP 2FA secret generation and QR code verification endpoints.
[00:40] Marwan Elgammal: Great job. Ensure all routes under /api/communities verify community membership.`,
        summary: "Conducted security review of JWT authentication, 2FA TOTP implementation, and community role guards. Verified middleware safety checks.",
        meetingOverview: "Security audit focused on token lifecycle management and multi-factor authentication resilience.",
        topics: ["Security Audit", "JWT Rotation", "2FA TOTP", "Role Authorization"],
        decisions: [
            { text: "Enforce strict User DB lookup in authMiddleware to handle deleted accounts gracefully.", confidence: 0.98 }
        ],
        actionItems: [
            { title: "Implement null check for decoded user in authMiddleware", assignedTo: "Sarah Jenkins", priority: "high", daysOffset: 1 },
            { title: "Add unit tests for speakeasy 2FA QR verification flow", assignedTo: "Youssef Ahmed", priority: "medium", daysOffset: 3 }
        ]
    },
    {
        title: "SmartMeet Product Demo & Release Planning",
        description: "Final walkthrough of dashboard analytics, team management features, and AI meeting assistant for v1.0 launch.",
        daysAgo: 0, // Today
        duration: 60,
        type: "Team",
        participantEmails: ["ebrahim@gmail.com", "youssef@gmail.com", "zena@gmail.com", "hana@gmail.com", "sarah@gmail.com"],
        transcript: `[00:00] Marwan Elgammal: Welcome everyone to our v1.0 release planning and live demo sync!
[00:15] Hana Mahmoud: Dashboard charts and member stats are fully hooked up to the backend APIs.
[00:30] Zena Elsayed: UI components are polished with dark mode styling and reactive cards.
[00:45] Ebrahim Hassan: RAG search and AI transcript extraction are operating smoothly.
[01:00] Marwan Elgammal: Outstanding work team. Let's run full verification and prepare launch announcements!`,
        summary: "Product demo of SmartMeet v1.0. All core modules (dashboard stats, community team management, AI meeting knowledge, and live transcripts) verified ready for release.",
        meetingOverview: "Final milestone sync celebrating project completion and setting deployment steps.",
        topics: ["Release Planning", "Product Demo", "Dashboard Analytics", "v1.0 Launch"],
        decisions: [
            { text: "Approved SmartMeet v1.0 build for production release.", confidence: 0.99 }
        ],
        actionItems: [
            { title: "Prepare release notes and documentation walkthrough", assignedTo: "Hana Mahmoud", priority: "medium", daysOffset: 2 }
        ]
    }
];

// ─── Main Execution ─────────────────────────────────────────────────────────
const run = async () => {
    await connectDB();
    console.log("\n═══════════════════════════════════════════════════════════");
    console.log("🌱 SmartMeet — Master Team & Dashboard Seed Script");
    console.log("═══════════════════════════════════════════════════════════\n");

    // 1. Admin Account & Community
    let admin = await User.findOne({ email: ADMIN_EMAIL });
    if (!admin) {
        admin = new User({
            name: "Marwan Elgammal",
            firstName: "Marwan",
            lastName: "Elgammal",
            email: ADMIN_EMAIL,
            password: DEFAULT_PASSWORD,
            role: "admin",
            status: "active",
            jobTitle: "Product Lead & Founder",
            company: "SmartMeet HQ",
        });
        await admin.save();
        console.log(`✓ Created Admin User: ${admin.name} (${admin.email})`);
    } else {
        console.log(`✓ Existing Admin User: ${admin.name} (${admin.email})`);
    }

    let communityId = admin.community;
    let communityDoc = communityId ? await Community.findById(communityId) : null;
    if (!communityDoc) {
        const code = "SM-" + crypto.randomBytes(3).toString("hex").toUpperCase();
        communityDoc = await Community.create({
            name: `${admin.firstName || "Marwan"}'s Community Workspace`,
            code,
            owner: admin._id,
            description: "SmartMeet Core Development & Engineering Workspace",
        });
        communityId = communityDoc._id;
        admin.community = communityId;
        await admin.save();
        console.log(`✓ Created Community Workspace: ${communityDoc.name} [Code: ${communityDoc.code}]`);
    } else {
        console.log(`✓ Found Community Workspace: ${communityDoc.name} [Code: ${communityDoc.code}]`);
    }

    // 2. Team Members
    console.log("\n👥 Seeding Team Members...");
    const userMap = new Map();
    userMap.set("Marwan Elgammal", admin);
    userMap.set("Marwan", admin);
    userMap.set(admin.email, admin);

    for (const member of TEAM_MEMBERS) {
        let user = await User.findOne({ email: member.email });
        if (!user) {
            user = new User({
                name: member.name,
                firstName: member.firstName,
                lastName: member.lastName,
                email: member.email,
                password: DEFAULT_PASSWORD,
                role: "user",
                jobTitle: member.jobTitle,
                company: member.company,
                community: communityId,
                status: "active",
            });
            await user.save();
            console.log(`   ✓ Created Member: ${user.name.padEnd(20)} (${user.jobTitle})`);
        } else {
            user.community = communityId;
            user.status = "active";
            user.jobTitle = member.jobTitle;
            await user.save();
            console.log(`   ↺ Updated Member: ${user.name.padEnd(20)} (${user.jobTitle})`);
        }
        userMap.set(user.name, user);
        userMap.set(user.firstName, user);
        userMap.set(user.email, user);
    }

    // 3. Meetings, Transcripts, Knowledge & Action Items
    console.log("\n📅 Seeding Meetings, Transcripts, Knowledge Layers & Action Items...");
    const now = new Date();

    for (const data of MEETINGS_DATA) {
        const meetingDate = new Date(now);
        meetingDate.setDate(now.getDate() - data.daysAgo);
        
        const startTime = new Date(meetingDate);
        startTime.setHours(10, 0, 0, 0);
        
        const endTime = new Date(startTime);
        endTime.setMinutes(startTime.getMinutes() + data.duration);

        // Idempotency check: title + host
        let meeting = await Meeting.findOne({ title: data.title, host: admin._id });
        if (!meeting) {
            const participants = data.participantEmails.map((email) => {
                const u = userMap.get(email);
                return {
                    name: u ? u.name : email,
                    email: email,
                    role: u ? u.jobTitle : "Participant",
                };
            });
            // Include admin as participant host
            participants.unshift({
                name: admin.name,
                email: admin.email,
                role: admin.jobTitle || "Host",
            });

            meeting = await Meeting.create({
                title: data.title,
                description: data.description,
                host: admin._id,
                participants,
                startTime,
                endTime,
                duration: data.duration,
                type: data.type,
                status: data.daysAgo === 0 ? "scheduled" : "completed",
                meetingId: generateMeetingId(),
            });
            console.log(`   ✓ Created Meeting: "${meeting.title}"`);
        } else {
            console.log(`   ↺ Existing Meeting: "${meeting.title}"`);
        }

        // MeetingTranscript layer
        let transcriptDoc = await MeetingTranscript.findOne({ meeting: meeting._id });
        if (!transcriptDoc) {
            const chunks = [
                {
                    index: 0,
                    text: data.transcript.slice(0, Math.floor(data.transcript.length / 2)),
                    startChar: 0,
                    endChar: Math.floor(data.transcript.length / 2),
                    tokenEstimate: 120,
                },
                {
                    index: 1,
                    text: data.transcript.slice(Math.floor(data.transcript.length / 2)),
                    startChar: Math.floor(data.transcript.length / 2),
                    endChar: data.transcript.length,
                    tokenEstimate: 130,
                },
            ];

            await MeetingTranscript.create({
                meeting: meeting._id,
                transcript: data.transcript,
                chunks,
                durationSeconds: data.duration * 60,
            });
        }

        // MeetingKnowledge layer
        let knowledgeDoc = await MeetingKnowledge.findOne({ meeting: meeting._id });
        if (!knowledgeDoc) {
            await MeetingKnowledge.create({
                meeting: meeting._id,
                summary: data.summary,
                meetingOverview: data.meetingOverview,
                topics: data.topics,
                participants: meeting.participants.map((p) => p.name),
                decisions: data.decisions,
                followUpTasks: data.actionItems.map((a) => ({
                    text: a.title,
                    owner: a.assignedTo,
                    confidence: 0.95,
                })),
            });
        }

        // ActionItems
        for (const item of data.actionItems) {
            const deadlineDate = new Date(now);
            deadlineDate.setDate(now.getDate() + item.daysOffset);

            const existingAction = await ActionItem.findOne({ meeting: meeting._id, title: item.title });
            if (!existingAction) {
                await ActionItem.create({
                    meeting: meeting._id,
                    title: item.title,
                    assignedTo: item.assignedTo,
                    deadline: deadlineDate,
                    status: item.daysOffset < 0 ? "done" : "in_progress",
                    priority: item.priority,
                    sourceText: `Seeded from meeting ${meeting.title}`,
                });
            }
        }
    }

    // 4. Tasks for Dashboard Metrics, Activity Charts & AI Insights
    console.log("\n📊 Seeding Tasks for Dashboard Charts & AI Insights...");

    // Clear previous seeded demo tasks for clean metrics replay
    await Task.deleteMany({ source: "SeedScript" });

    const taskEntries = [];

    // Historical Completed Tasks for the past 30 days (drives Activity Chart & Stats)
    for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
        const taskDate = new Date(now);
        taskDate.setDate(now.getDate() - dayOffset);

        // Generate 1-4 completed tasks per day for realistic charts
        const countForDay = (dayOffset % 3) + 1;
        for (let i = 0; i < countForDay; i++) {
            const assigneeUser = TEAM_MEMBERS[i % TEAM_MEMBERS.length];

            taskEntries.push({
                user: admin._id,
                community: communityId,
                createdBy: admin._id,
                title: `Completed Feature Module ${30 - dayOffset}.${i + 1}`,
                description: `Delivered and verified core module for ${assigneeUser.jobTitle}`,
                priority: i % 2 === 0 ? "HIGH PRIORITY" : "MEDIUM PRIORITY",
                status: "done",
                done: true,
                assignee: assigneeUser.name,
                avatarColor: assigneeUser.avatarColor,
                source: "SeedScript",
                updatedAt: taskDate,
                createdAt: taskDate,
            });
        }
    }

    // Active & Pending Tasks
    const activeTasksSpec = [
        { title: "Audit CSS Design Tokens & Variable Overrides", priority: "HIGH PRIORITY", status: "inprogress", daysDue: -2, assignee: "Zena Elsayed" }, // Overdue task (triggers AI insight)
        { title: "Refactor Auth Middleware Decoded User Null Safety", priority: "HIGH PRIORITY", status: "inprogress", daysDue: 1, assignee: "Sarah Jenkins" },
        { title: "Implement MongoDB Aggregation Pipeline for Analytics", priority: "MEDIUM PRIORITY", status: "todo", daysDue: 3, assignee: "Youssef Ahmed" },
        { title: "Build Vue 3 Multi-Step Invitation Modal", priority: "MEDIUM PRIORITY", status: "review", daysDue: 2, assignee: "Hana Mahmoud" },
        { title: "Configure ChromaDB Vector Indexing for RAG", priority: "HIGH PRIORITY", status: "todo", daysDue: 4, assignee: "Ebrahim Hassan" },
    ];

    for (const spec of activeTasksSpec) {
        const dueDate = new Date(now);
        dueDate.setDate(now.getDate() + spec.daysDue);
        const dateStr = dueDate.toISOString().split("T")[0];

        taskEntries.push({
            user: admin._id,
            community: communityId,
            createdBy: admin._id,
            title: spec.title,
            description: `Active task for ${spec.assignee}`,
            priority: spec.priority,
            status: spec.status,
            done: spec.status === "done",
            assignee: spec.assignee,
            due: dateStr,
            dueDate: dateStr,
            dueTime: "18:00",
            source: "SeedScript",
            updatedAt: now,
            createdAt: now,
        });
    }

    await Task.insertMany(taskEntries);
    console.log(`   ✓ Seeded ${taskEntries.length} tasks across past 30 days for activity charts.`);

    // 5. Additional Meetings Today/Tomorrow for "MEETING BURNOUT RISK" AI Insight
    const todayMeetingCount = await Meeting.countDocuments({
        host: admin._id,
        startTime: { $gte: new Date(new Date().setHours(0, 0, 0, 0)), $lte: new Date(new Date().setHours(23, 59, 59, 999)) }
    });

    if (todayMeetingCount < 3) {
        const extraMeetingsToCreate = 3 - todayMeetingCount;
        for (let k = 1; k <= extraMeetingsToCreate; k++) {
            const sTime = new Date();
            sTime.setHours(11 + k * 2, 0, 0, 0);
            const eTime = new Date(sTime);
            eTime.setMinutes(sTime.getMinutes() + 30);

            await Meeting.create({
                title: `Sprint Sync Session ${k}`,
                description: "Short touchpoint with design and engineering leads.",
                host: admin._id,
                participants: [
                    { name: admin.name, email: admin.email, role: "Host" },
                    { name: "Zena Elsayed", email: "zena@gmail.com", role: "UI/UX Designer" }
                ],
                startTime: sTime,
                endTime: eTime,
                duration: 30,
                type: "Standup",
                status: "scheduled",
                meetingId: generateMeetingId(),
            });
        }
        console.log(`   ✓ Created additional scheduled meetings today to populate AI Insights.`);
    }

    console.log("\n═══════════════════════════════════════════════════════════");
    console.log("✅ SmartMeet Seeding Complete!");
    console.log("═══════════════════════════════════════════════════════════");
    console.log(`👑 Admin Account    : ${ADMIN_EMAIL} (Password: ${DEFAULT_PASSWORD})`);
    console.log(`🏢 Community Code  : ${communityDoc.code}`);
    console.log(`👥 Team Members     : ${TEAM_MEMBERS.length} seeded & active`);
    console.log(`📅 Meetings Seeded  : ${MEETINGS_DATA.length} meetings with knowledge & transcripts`);
    console.log(`📊 Dashboard Tasks  : ${taskEntries.length} historical & active tasks`);
    console.log("═══════════════════════════════════════════════════════════\n");

    await mongoose.disconnect();
};

run().catch(async (err) => {
    console.error("❌ Seed Script Error:", err);
    await mongoose.disconnect();
    process.exit(1);
});
