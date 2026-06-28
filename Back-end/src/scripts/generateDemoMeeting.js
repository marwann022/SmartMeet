/**
 * generateDemoMeeting.js
 * ──────────────────────
 * Creates a realistic demo meeting, runs it through the full AI pipeline
 * (Groq analysis → transcript store → knowledge layers → embeddings),
 * and saves everything to MongoDB so it appears in the Archive page.
 *
 * Usage:
 *   node src/scripts/generateDemoMeeting.js
 *
 * Optional env:
 *   HOST_EMAIL=you@example.com   (defaults to first user found)
 */

import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";
import Meeting from "../models/Meeting.js";
import { analyzeMeetingTranscript } from "../services/meetingAnalysisService.js";
import { storeTranscriptLayer, storeKnowledgeLayers, generateAndStoreEmbeddings } from "../services/knowledgeStorageService.js";

// ─── Demo Transcript ──────────────────────────────────────────────────────────
const DEMO_TRANSCRIPT = `
[00:00] Marwan Elgammal: Good morning everyone. Let's get started with our Q3 product roadmap sync. We have a lot to cover today — the dashboard redesign, the AI pipeline improvements, and the mobile release timeline.

[00:22] Sarah Jenkins: Morning Marwan. Quick heads up — Ahmed is joining 5 minutes late, he's finishing a deployment.

[00:30] Marwan Elgammal: No problem. Let's start with the dashboard redesign. Alex, can you give us a status update?

[00:37] Alex Chen: Sure. The new bento grid layout is about 80% done. The main blocker right now is the dark mode token system — some of our component variants are still using hardcoded hex colors instead of the CSS variables. I need to audit those by end of this week.

[01:02] Marwan Elgammal: That's a high priority. Alex, let's make that your action item — audit and fix all hardcoded colors in the component library by Friday June 30th.

[01:14] Alex Chen: Got it. I'll open a tracking issue on GitHub today and aim to have a PR by Thursday.

[01:22] Sarah Jenkins: Also on the dashboard — the archive search performance is really slow when there are more than 50 meetings. We're doing a full collection scan. I think we need a compound index on host and status and startTime.

[01:38] Marwan Elgammal: Great catch Sarah. Can you add that index migration and test it in staging this week?

[01:45] Sarah Jenkins: Yes, I'll handle it. I'll also update the query in meetingKnowledgeController to use the index properly.

[02:00] Marwan Elgammal: Perfect. Now let's talk about the AI pipeline. The live transcript to AI analysis flow is working now, but I want to add a retry mechanism for when Groq rate-limits us during peak usage.

[02:18] Alex Chen: I can build a simple exponential backoff wrapper around the Groq client. Should take about half a day.

[02:26] Marwan Elgammal: Let's do it. Alex, please implement the retry logic with exponential backoff for the Groq API calls. Target deadline is next Monday July 1st.

[02:38] Sarah Jenkins: We should also add a fallback model. If the primary model fails, switch to a smaller one automatically.

[02:47] Marwan Elgammal: Agreed. Let's decide — we'll use llama-3.1-8b-instant as the fallback model. Sarah, can you update the environment config and the meetingAnalysisService to support a fallback model variable?

[03:02] Sarah Jenkins: Will do. I'll add GROQ_FALLBACK_MODEL to the .env and implement the fallback logic. I'll have it done by Tuesday July 2nd.

[03:15] Marwan Elgammal: Now for mobile. Ahmed's team is targeting a TestFlight release by July 15th. The main risk right now is the Jitsi embedded call on Safari iOS — it doesn't support the same WebRTC constraints as Chrome.

[03:32] Sarah Jenkins: I noticed that too. The speech recognition API also doesn't work on Safari iOS at all — it's not supported.

[03:42] Marwan Elgammal: That's a blocker for mobile. We need to decide whether to use native iOS speech APIs or rely purely on the server-side Whisper transcription for mobile users.

[03:55] Alex Chen: Given the timeline, I'd recommend Whisper server-side for iOS. It's already built and tested. We just need to add the recording upload flow from the mobile app.

[04:05] Marwan Elgammal: Agreed. That's decided — iOS will use server-side Whisper transcription, not the browser SpeechRecognition API. Ahmed should document this in the mobile architecture spec.

[04:18] Sarah Jenkins: One open question — what's the maximum recording file size we'll accept? The current uploadRecording endpoint doesn't enforce a limit.

[04:28] Marwan Elgammal: Good point. Let's cap it at 500MB. Sarah, please add a file size validation middleware to the upload endpoint this week.

[04:38] Sarah Jenkins: Sure. I'll add it as a Multer option. Done by end of week.

[04:45] Marwan Elgammal: Great work everyone. To summarize decisions: dark mode color audit by Friday, archive index migration this week, Groq retry logic by Monday, fallback model by Tuesday, iOS uses Whisper, 500MB upload cap. Any blockers I'm missing?

[05:00] Alex Chen: Nothing from me.

[05:02] Sarah Jenkins: All good here.

[05:05] Marwan Elgammal: Perfect. Next sync is Thursday. Thanks everyone.
`.trim();

// ─── Main ─────────────────────────────────────────────────────────────────────
const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✓ Connected to MongoDB\n");

    // Find host user
    const hostEmail = process.env.HOST_EMAIL;
    const host = hostEmail
        ? await User.findOne({ email: hostEmail })
        : await User.findOne({ email: "marwanelgammal5@outlook.com" }) || await User.findOne({});

    if (!host) throw new Error("No user found. Register a user first.");
    console.log(`✓ Host: ${host.name} (${host.email})`);

    // Create meeting record
    const meeting = await Meeting.create({
        title: "Q3 Product Roadmap Sync",
        description: "Dashboard redesign status, AI pipeline improvements, mobile release timeline, and architecture decisions for iOS.",
        host: host._id,
        startTime: new Date("2026-06-28T10:00:00"),
        endTime: new Date("2026-06-28T10:05:05"),
        duration: 30,
        type: "Team",
        status: "live",
        recordingPath: "",
        participants: [
            { name: "Sarah Jenkins", email: "sarah@example.com", role: "Backend Engineer" },
            { name: "Alex Chen", email: "alex@example.com", role: "Frontend Engineer" },
            { name: "Ahmed", email: "ahmed@example.com", role: "Mobile Engineer" },
        ],
    });
    console.log(`✓ Meeting created: "${meeting.title}" (${meeting._id})\n`);

    // Step 1: AI Analysis (Groq)
    console.log("⏳ Step 1/4 — Running Groq AI analysis...");
    const analysis = await analyzeMeetingTranscript({ transcript: DEMO_TRANSCRIPT, meeting });
    console.log(`   ✓ Summary generated (${analysis.summary?.length} chars)`);
    console.log(`   ✓ Action items: ${analysis.actionItems?.length}`);
    console.log(`   ✓ Decisions: ${analysis.decisions?.length}`);
    console.log(`   ✓ Topics: ${analysis.topics?.join(", ")}\n`);

    // Step 2: Store transcript
    console.log("⏳ Step 2/4 — Storing transcript in MongoDB...");
    await storeTranscriptLayer({
        meeting,
        transcript: DEMO_TRANSCRIPT,
        sourceAudioPath: "",
        durationSeconds: 305,
    });
    console.log("   ✓ MeetingTranscript document saved\n");

    // Step 3: Store knowledge layers
    console.log("⏳ Step 3/4 — Storing knowledge layers & action items...");
    await storeKnowledgeLayers({ meeting, analysis });
    console.log("   ✓ MeetingKnowledge document saved");
    console.log("   ✓ ActionItem documents saved\n");

    // Step 4: Generate embeddings
    console.log("⏳ Step 4/4 — Generating embeddings & storing vectors...");
    try {
        await generateAndStoreEmbeddings({ meeting, transcript: DEMO_TRANSCRIPT });
        console.log("   ✓ MeetingEmbedding vectors stored\n");
    } catch (err) {
        console.warn("   ⚠ Embeddings skipped:", err.message, "\n");
    }

    // Mark as completed
    await Meeting.updateOne(
        { _id: meeting._id },
        { $set: { status: "completed", endTime: new Date("2026-06-28T10:05:05") } }
    );

    console.log("═══════════════════════════════════════════");
    console.log("✅ SUCCESS — Meeting is live in Archive now!");
    console.log(`   Title   : ${meeting.title}`);
    console.log(`   ID      : ${meeting._id}`);
    console.log(`   Summary : ${analysis.summary?.slice(0, 120)}...`);
    console.log("═══════════════════════════════════════════");

    await mongoose.disconnect();
};

run().catch(async (err) => {
    console.error("❌ Script failed:", err.message);
    await mongoose.disconnect();
    process.exit(1);
});
