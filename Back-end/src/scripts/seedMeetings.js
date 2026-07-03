/**
 * seedMeetings.js
 * ─────────────────────────────────────────────────────────────────
 * Seeds 6 historical SmartMeet team meetings with full knowledge
 * layers (MeetingKnowledge, ActionItems, MeetingTranscript) directly
 * into MongoDB — no AI API calls required.
 *
 * Idempotent: skips meetings whose title+host already exist.
 *
 * Usage:
 *   node src/scripts/seedMeetings.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import crypto from "crypto";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Meeting from "../models/Meeting.js";
import MeetingTranscript from "../models/MeetingTranscript.js";
import MeetingKnowledge from "../models/MeetingKnowledge.js";
import ActionItem from "../models/ActionItem.js";

const ADMIN_EMAIL = "marwanelgammal5@outlook.com";
const generateMeetingId = () => crypto.randomBytes(12).toString("hex");

// ─── Meeting Dataset ─────────────────────────────────────────────
const MEETINGS = [
    {
        title: "SmartMeet Project Kickoff & UI/UX Alignment",
        description: "Initial scope definition for SmartMeet SaaS, design system review, and Figma wireframe walkthrough.",
        date: "2026-06-15",
        startTime: new Date("2026-06-15T09:00:00"),
        endTime: new Date("2026-06-15T09:45:00"),
        duration: 45,
        type: "Team",
        participantEmails: ["zena@gmail.com", "hana@gmail.com"],
        transcript: `[00:00] Marwan Elgammal: Good morning team. Today we're kicking off SmartMeet officially. Let's align on scope and design direction.
[00:10] Zena: I've prepared the initial Figma wireframes for the landing page and dashboard. The design system is built around a clean dark mode palette.
[00:25] Marwan Elgammal: Excellent. Zena, can you present the color tokens and component variants?
[00:30] Zena: Sure. The primary color is a deep indigo at #4B68FF and we have a complete slate-based dark surface system.
[01:00] Hana: Love it. I'll initialize the Vue 3 repo this week and set up Tailwind so the tokens are ready to consume.
[01:10] Marwan Elgammal: Perfect. Let's approve the dark mode palette officially and set our first deliverables.
[01:20] Zena: Finalized mockups for TaskCard.vue by June 20th — that works for me.
[01:30] Hana: Vue 3 repo initialized by June 22nd. Confirmed.`,
        summary:
            "Defined initial scope for the SmartMeet SaaS platform. Zena presented the foundational design system and initial Figma wireframes for the landing page and user dashboard. The team approved the dark mode color palette and set first sprint deliverables.",
        meetingOverview:
            "Kickoff session establishing SmartMeet's design foundations, technology stack alignment, and first actionable milestones for the UI/UX and frontend teams.",
        topics: ["Project Kickoff", "Design System", "Dark Mode Palette", "Figma Wireframes", "Vue 3 Setup"],
        decisions: [
            {
                text: "Approved the clean dark mode palette (#4B68FF primary, slate surfaces) for the user profile and dashboard interfaces.",
                confidence: 0.97,
            },
        ],
        actionItems: [
            {
                title: "Finalize high-fidelity mockups for TaskCard.vue",
                assignedTo: "Zena",
                priority: "high",
                deadline: new Date("2026-06-20"),
                sourceText: "Zena: Finalized mockups for TaskCard.vue by June 20th — that works for me.",
            },
            {
                title: "Initialize Vue 3 repository with Tailwind CSS",
                assignedTo: "Hana",
                priority: "high",
                deadline: new Date("2026-06-22"),
                sourceText: "Hana: Vue 3 repo initialized by June 22nd. Confirmed.",
            },
        ],
    },
    {
        title: "Backend Architecture & Database Schema Design",
        description: "Node.js/MongoDB architecture planning, Mongoose schema finalization, and AI pipeline integration hooks.",
        date: "2026-06-19",
        startTime: new Date("2026-06-19T10:00:00"),
        endTime: new Date("2026-06-19T11:00:00"),
        duration: 60,
        type: "Team",
        participantEmails: ["ebrahim@gmail.com", "youssef@gmail.com"],
        transcript: `[00:00] Marwan Elgammal: Let's finalize the backend architecture. We're using Node.js with Express and MongoDB.
[00:15] Ebrahim: I've drafted the middleware stack — JWT auth, role guards, and a community scoping layer.
[00:30] Youssef: I've prepared the initial Mongoose schemas for User, Meeting, Task, and ActionItem.
[00:45] Marwan Elgammal: Good. Let's discuss the AI vector pipeline. We need hooks so that after a meeting is processed, embeddings go into MongoDB or Pinecone.
[01:00] Youssef: I'll set up the MongoDB connection layer and deploy the schemas to Atlas this week.
[01:10] Ebrahim: I'll build the auth middleware and base routing by June 24th.
[01:20] Marwan Elgammal: Agreed. We'll use Mongoose as our ODM and enforce strict Date validations for all deadline fields — no string placeholders.`,
        summary:
            "Outlined backend architecture using Node.js and MongoDB. Finalized schemas for User, Meeting, and Task models. Discussed integration hooks for the AI vector storage pipeline.",
        meetingOverview:
            "Technical design session establishing the backend architecture, Mongoose ODM selection, and first implementation milestones for the auth and schema layers.",
        topics: ["Backend Architecture", "Mongoose ODM", "Database Schemas", "Auth Middleware", "Vector Storage Hooks"],
        decisions: [
            {
                text: "Chose Mongoose as the ODM and agreed to enforce strict Date validations for all deadline fields — no string placeholder values allowed.",
                confidence: 0.98,
            },
        ],
        actionItems: [
            {
                title: "Build authMiddleware and standard base routing layer",
                assignedTo: "Ebrahim",
                priority: "high",
                deadline: new Date("2026-06-24"),
                sourceText: "Ebrahim: I'll build the auth middleware and base routing by June 24th.",
            },
            {
                title: "Set up MongoDB connections and deploy initial model schemas",
                assignedTo: "Youssef",
                priority: "high",
                deadline: new Date("2026-06-24"),
                sourceText: "Youssef: I'll set up the MongoDB connection layer and deploy the schemas to Atlas this week.",
            },
        ],
    },
    {
        title: "Frontend Component & Layout Implementation",
        description: "Authenticated layout skeleton review, sidebar configuration, and task dashboard component design decisions.",
        date: "2026-06-23",
        startTime: new Date("2026-06-23T09:30:00"),
        endTime: new Date("2026-06-23T10:15:00"),
        duration: 45,
        type: "Team",
        participantEmails: ["hana@gmail.com", "zena@gmail.com"],
        transcript: `[00:00] Marwan Elgammal: Today Hana is walking us through the authenticated layout skeleton.
[00:10] Hana: Here's the main layout — sidebar on the left, top nav bar with notification bell, and a main content area using a CSS grid.
[00:25] Zena: The sidebar icons are matching the Figma spec. The spacing is good. Let me check the dashboard view alignment.
[00:40] Marwan Elgammal: Looks great. One decision — we should group tasks by priority rather than by completion tag in the default task dashboard view.
[00:50] Zena: Agreed. Priority grouping makes more sense as the default.
[01:00] Hana: I'll start building out the TaskCard and DashboardTasks components after this.
[01:10] Zena: I'll export the vector icon assets and clean SVG branding files by June 25th.
[01:15] Hana: TaskCard and DashboardTasks base structure by June 27th from me.`,
        summary:
            "Hana demonstrated the authenticated layout skeleton, sidebar configuration, and global navigation blocks. Zena verified alignment with UX design documentation. The team agreed on the default dashboard grouping behavior.",
        meetingOverview:
            "Frontend implementation sync reviewing layout architecture, component hierarchy, and dashboard configuration decisions.",
        topics: ["Authenticated Layout", "Sidebar Navigation", "TaskCard Component", "Dashboard Priority Grouping", "SVG Assets"],
        decisions: [
            {
                text: "Fixed the default views for the task dashboard to group by priority metrics rather than raw completion tags.",
                confidence: 0.96,
            },
        ],
        actionItems: [
            {
                title: "Construct TaskCard and DashboardTasks base components",
                assignedTo: "Hana",
                priority: "high",
                deadline: new Date("2026-06-27"),
                sourceText: "Hana: TaskCard and DashboardTasks base structure by June 27th from me.",
            },
            {
                title: "Export vector assets and clean SVG iconography for product branding",
                assignedTo: "Zena",
                priority: "medium",
                deadline: new Date("2026-06-25"),
                sourceText: "Zena: I'll export the vector icon assets and clean SVG branding files by June 25th.",
            },
        ],
    },
    {
        title: "AI Service Layer & Groq Key Security Migration",
        description: "Security audit of exposed Groq API configurations, chunking pipeline debugging, and extraction service refactor.",
        date: "2026-06-26",
        startTime: new Date("2026-06-26T10:00:00"),
        endTime: new Date("2026-06-26T10:50:00"),
        duration: 50,
        type: "Team",
        participantEmails: ["ebrahim@gmail.com", "youssef@gmail.com"],
        transcript: `[00:00] Marwan Elgammal: We have a security issue to address first. The Groq API key was briefly exposed in a commit. We need to rotate it immediately.
[00:10] Ebrahim: Already on it. The key is invalidated. I'll audit all controllers to make sure no other env values are hardcoded.
[00:20] Youssef: The text chunking logic has a bug — it's splitting mid-sentence on some transcripts. I debugged it and found the chunk boundary logic isn't respecting punctuation.
[00:35] Marwan Elgammal: Good catch. Fix that and refactor the system instruction templates in the service layer so all prompt constraints are internal.
[00:45] Youssef: I'll refine the instruction templates and test against three sample transcripts. Done by June 29th.
[00:50] Ebrahim: Environment loading checks across all backend controllers by June 28th. Confirmed.
[01:00] Marwan Elgammal: Rotated keys immediately. Refactor the pipeline to hide prompt constraints inside internal service layers — that's our agreed decision.`,
        summary:
            "Reviewed and resolved a security alert regarding exposed Groq environment configurations. Debugged the primary text chunking logic for meeting transcript parsing and agreed on refactoring the extraction pipeline.",
        meetingOverview:
            "Security and AI pipeline maintenance session covering key rotation, chunking bug resolution, and service layer hardening.",
        topics: ["API Key Security", "Groq Configuration", "Chunking Logic", "Prompt Engineering", "Service Layer Refactor"],
        decisions: [
            {
                text: "Rotated Groq API keys immediately and refactored the extraction pipeline to hide prompt constraints inside internal service layers — no hardcoded credentials in controllers.",
                confidence: 0.99,
            },
        ],
        actionItems: [
            {
                title: "Implement secure environment loading checks across all backend controllers",
                assignedTo: "Ebrahim",
                priority: "high",
                deadline: new Date("2026-06-28"),
                sourceText: "Ebrahim: Environment loading checks across all backend controllers by June 28th. Confirmed.",
            },
            {
                title: "Refine system instruction templates for prompt processing algorithms",
                assignedTo: "Youssef",
                priority: "high",
                deadline: new Date("2026-06-29"),
                sourceText: "Youssef: I'll refine the instruction templates and test against three sample transcripts. Done by June 29th.",
            },
        ],
    },
    {
        title: "API Integration & Semantic Vector Mapping Sync",
        description: "Frontend-to-backend API binding, RAG pipeline context failures, and deadline resolution flag implementation.",
        date: "2026-06-29",
        startTime: new Date("2026-06-29T09:00:00"),
        endTime: new Date("2026-06-29T09:55:00"),
        duration: 55,
        type: "Team",
        participantEmails: ["ebrahim@gmail.com", "youssef@gmail.com", "hana@gmail.com"],
        transcript: `[00:00] Marwan Elgammal: Good morning. Today we're connecting the frontend to live backend endpoints and addressing the RAG context failures.
[00:15] Hana: I've wired the TaskCard to the /api/tasks endpoint. The task status update is working. The date-picker still needs to dispatch the dueDate update on change.
[00:28] Marwan Elgammal: Hana, make that your action item — bind the date-picker to fire update dispatches automatically. Deadline July 1st.
[00:35] Ebrahim: The RAG system is generating cross-context failures when queries use relative timelines like "last meeting". The vector search isn't scoped to the most recent meeting.
[00:50] Youssef: The fix is to add metadata sorting inside the vector storage queries — we sort by date descending before returning results.
[01:00] Marwan Elgammal: Agreed. Youssef, implement that sorting. Deadline July 2nd.
[01:10] Marwan Elgammal: We also need a field for tasks where no deadline can be inferred from context. Let's add needsAdminDeadlineResolution as a boolean on the Task model.
[01:20] Ebrahim: Makes sense. Admins can then filter and resolve those manually.`,
        summary:
            "Connected frontend TaskCard structures directly to real backend API endpoints. Addressed issues where relative timelines in the RAG pipeline generated cross-context failures.",
        meetingOverview:
            "Integration sync covering API binding, RAG vector context scoping, and the needsAdminDeadlineResolution flag decision.",
        topics: ["API Integration", "RAG Pipeline", "Vector Context Scoping", "Date Picker Binding", "needsAdminDeadlineResolution"],
        decisions: [
            {
                text: 'Agreed to add a fallback boolean field "needsAdminDeadlineResolution" on tasks extracted from meetings when the transcript context offers no explicit time reference.',
                confidence: 0.97,
            },
        ],
        actionItems: [
            {
                title: "Bind frontend date-picker fields to fire automated update dispatches",
                assignedTo: "Hana",
                priority: "high",
                deadline: new Date("2026-07-01"),
                sourceText: "Hana: The date-picker still needs to dispatch the dueDate update on change.",
            },
            {
                title: "Integrate standard metadata sorting inside vector storage queries",
                assignedTo: "Youssef",
                priority: "high",
                deadline: new Date("2026-07-02"),
                sourceText: "Youssef: The fix is to add metadata sorting inside the vector storage queries — sort by date descending.",
            },
        ],
    },
    {
        title: "Pre-Demo Refinement & RAG Context Fixes",
        description: "Final alignment before platform milestone review — admin override verification, RAG relative timeline fixes, and TBD cleanup.",
        date: "2026-07-02",
        startTime: new Date("2026-07-02T09:00:00"),
        endTime: new Date("2026-07-02T10:00:00"),
        duration: 60,
        type: "Team",
        participantEmails: ["ebrahim@gmail.com", "youssef@gmail.com", "zena@gmail.com", "hana@gmail.com"],
        transcript: `[00:00] Marwan Elgammal: This is our final sync before the milestone demo. Let's walk through everything.
[00:10] Ebrahim: Admin override on meeting summaries is working. Tested it — admin can edit any meeting summary regardless of host.
[00:20] Hana: The deadline alert banner is rendering correctly on TaskCard when needsAdminDeadlineResolution is true and the user is admin.
[00:30] Youssef: The relative timeline context searches are now parsing correctly. "What happened in the last meeting" correctly scopes to the most recent meeting in the database.
[00:45] Zena: Design QA is clean. All components match the Figma spec.
[00:55] Marwan Elgammal: Final decision — drop all structural fallback assignments that replaced blank entries with "TBD". Dates must be real or flagged for admin resolution.
[01:05] Ebrahim: Final staging regressions on the auth interceptors by July 4th. On it.
[01:10] Hana: I'll add the admin danger flag banner for missing date warnings to the frontend by July 4th as well.
[01:20] Marwan Elgammal: Great work everyone. The platform is looking solid.`,
        summary:
            'Final alignment check before platform milestone review. Successfully tested the admin override controls on meeting summaries and verified that relative timeline context searches parse properly.',
        meetingOverview:
            'Comprehensive pre-demo review session confirming all major features are functional: admin overrides, RAG context scoping, deadline flag banners, and design QA sign-off.',
        topics: ["Admin Override", "RAG Context Fixes", "Deadline Flags", "TBD Cleanup", "Design QA", "Staging Regression"],
        decisions: [
            {
                text: 'Dropped all structural fallback assignments that replaced blank entries with "TBD". All task deadlines must be concrete calendar dates or marked with needsAdminDeadlineResolution: true.',
                confidence: 0.99,
            },
        ],
        actionItems: [
            {
                title: "Run final staging server regressions on the auth interceptors",
                assignedTo: "Ebrahim",
                priority: "high",
                deadline: new Date("2026-07-04"),
                sourceText: "Ebrahim: Final staging regressions on the auth interceptors by July 4th. On it.",
            },
            {
                title: "Add the frontend admin danger flag banner for missing date warnings",
                assignedTo: "Hana",
                priority: "high",
                deadline: new Date("2026-07-04"),
                sourceText: "Hana: I'll add the admin danger flag banner for missing date warnings to the frontend by July 4th.",
            },
        ],
    },
];

// ─── Helpers ─────────────────────────────────────────────────────

const parseDate = (value) => {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
};

const buildParticipantList = (users, emails) =>
    emails
        .map((email) => {
            const u = users.find((m) => m.email === email);
            return u
                ? { name: `${u.firstName} ${u.lastName || ""}`.trim(), email: u.email, role: u.jobTitle || "Team Member" }
                : { name: email, email, role: "Team Member" };
        });

// ─── Main ────────────────────────────────────────────────────────

const run = async () => {
    await connectDB();
    console.log("\n═══════════════════════════════════════════════════");
    console.log("📅 SmartMeet — Historical Meeting Seed Script");
    console.log("═══════════════════════════════════════════════════\n");

    // Resolve host (admin)
    const host = await User.findOne({ email: ADMIN_EMAIL });
    if (!host) {
        console.error(`❌ Admin not found: ${ADMIN_EMAIL}. Run seedTeam.js first.`);
        process.exit(1);
    }
    console.log(`✓ Host: ${host.firstName} ${host.lastName} (${host.email})`);
    console.log(`✓ Community: ${host.community || "(none)"}\n`);

    // Resolve all community members for participant lookup
    const members = await User.find({ community: host.community, role: "user" }).lean();
    console.log(`✓ Found ${members.length} community members for participant resolution.\n`);

    let created = 0;
    let skipped = 0;

    for (let i = 0; i < MEETINGS.length; i++) {
        const data = MEETINGS[i];
        const num = String(i + 1).padStart(1, "0");

        process.stdout.write(`[${num}/${MEETINGS.length}] "${data.title}"... `);

        // Idempotency check — skip if this meeting already exists
        const alreadyExists = await Meeting.findOne({ title: data.title, host: host._id });
        if (alreadyExists) {
            console.log("⏭  SKIPPED (already exists)");
            skipped++;
            continue;
        }

        // ── 1. Create Meeting document ────────────────────────────
        const participants = buildParticipantList(members, data.participantEmails);
        const meeting = await Meeting.create({
            title: data.title,
            description: data.description,
            host: host._id,
            startTime: data.startTime,
            endTime: data.endTime,
            duration: data.duration,
            type: data.type,
            status: "completed",
            community: host.community || null,
            meetingId: generateMeetingId(),
            participants,
            recordingPath: "",
        });

        // ── 2. Store transcript ───────────────────────────────────
        await MeetingTranscript.create({
            meeting: meeting._id,
            transcript: data.transcript,
            sourceAudioPath: "",
            durationSeconds: data.duration * 60,
            chunks: [],
        });

        // ── 3. Store knowledge layer ──────────────────────────────
        await MeetingKnowledge.create({
            meeting: meeting._id,
            summary: data.summary,
            meetingOverview: data.meetingOverview,
            topics: data.topics,
            participants: participants.map((p) => p.name),
            decisions: data.decisions.map((d) => ({
                text: d.text,
                owner: "",
                deadline: null,
                confidence: d.confidence,
            })),
            deadlines: [],
            risks: [],
            openQuestions: [],
            agreements: [],
            disagreements: [],
            followUpTasks: [],
            analysisModel: "seed-script",
        });

        // ── 4. Store action items ─────────────────────────────────
        if (data.actionItems.length > 0) {
            await ActionItem.insertMany(
                data.actionItems.map((item) => ({
                    meeting: meeting._id,
                    title: item.title,
                    description: item.description || "",
                    assignedTo: item.assignedTo,
                    deadline: parseDate(item.deadline),
                    priority: item.priority || "medium",
                    sourceText: item.sourceText || "",
                    status: "open",
                    needsAdminDeadlineResolution: false,
                }))
            );
        }

        console.log(`✓ Created (${data.actionItems.length} action items)`);
        created++;
    }

    // ── Summary ───────────────────────────────────────────────────
    console.log("\n═══════════════════════════════════════════════════");
    console.log(`✅ Seed complete — ${created} meetings created, ${skipped} skipped.`);
    console.log("\n📋 Meeting Timeline:");
    for (const m of MEETINGS) {
        console.log(`   📅 ${m.date}  ${m.title}`);
    }
    console.log("═══════════════════════════════════════════════════\n");

    await mongoose.disconnect();
};

run().catch(async (err) => {
    console.error("❌ Seed failed:", err.message);
    console.error(err);
    await mongoose.disconnect();
    process.exit(1);
});
