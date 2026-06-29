import User from "../models/User.js";
import Task from "../models/Task.js";
import Notification from "../models/Notification.js";
import { sendMeetingSummaryEmail } from "./emailService.js";

/**
 * Post-Meeting enrichment and synchronization pipeline.
 * Runs immediately after a meeting transcript is analyzed and finalized.
 */
export const syncMeetingTasksAndNotifications = async ({ meeting, analysis }) => {
    try {
        console.log(`[PostMeetingPipeline] Starting sync for meeting: ${meeting.title} (${meeting._id})`);
        
        const communityId = meeting.community || meeting.host?.community;
        if (!communityId) {
            console.log("[PostMeetingPipeline] Meeting has no community scope — skipping sync.");
            return;
        }

        // Fetch all community members
        const members = await User.find({ community: communityId, status: "active" });
        if (members.length === 0) {
            console.log("[PostMeetingPipeline] No active members found in community — skipping sync.");
            return;
        }

        // 1. Sync tasks to Task collection
        const actionItems = analysis.actionItems || [];
        const decisions = analysis.decisions || [];
        const summaryText = analysis.summary || "No summary available.";
        
        console.log(`[PostMeetingPipeline] Processing ${actionItems.length} action items and ${decisions.length} decisions.`);

        const syncedTasks = [];

        for (const item of actionItems) {
            const assigneeName = (item.assignedTo || item.owner || "Unassigned").trim();
            let matchedUser = null;

            if (assigneeName.toLowerCase() !== "unassigned") {
                const target = assigneeName.toLowerCase();

                // 1. Try to match from the meeting participants list first (name or email)
                if (meeting.participants && meeting.participants.length > 0) {
                    const matchedParticipant = meeting.participants.find(p => {
                        const pName = p.name ? p.name.toLowerCase() : "";
                        const pEmail = p.email ? p.email.toLowerCase() : "";
                        return pName.includes(target) || target.includes(pName) || pEmail === target;
                    });

                    if (matchedParticipant && matchedParticipant.email) {
                        // Find this user in community members by email
                        matchedUser = members.find(m => m.email.toLowerCase() === matchedParticipant.email.toLowerCase());
                    }
                }

                // 2. Fall back to direct community member name/email matching
                if (!matchedUser) {
                    matchedUser = members.find(m => {
                        const fullName = `${m.firstName} ${m.lastName}`.toLowerCase();
                        const email = m.email.toLowerCase();
                        return fullName.includes(target) || target.includes(m.firstName.toLowerCase()) || email === target;
                    });
                }
            }

            // Determine user ID owner for the Task document
            const taskOwnerId = matchedUser ? matchedUser._id : meeting.host._id || meeting.host;
            
            // Create a Task document in the Task board collection
            const createdTask = await Task.create({
                user: taskOwnerId,
                community: communityId,
                createdBy: meeting.host?._id || meeting.host,
                isPersonal: false, // so community members can see it if matched to them
                title: item.title || item.text || "Untitled action item",
                description: item.description || item.sourceText || `Action item extracted from meeting: ${meeting.title}`,
                priority: (item.priority || "medium").toLowerCase() === "high" ? "HIGH PRIORITY" : (item.priority || "medium").toLowerCase() === "low" ? "LOW PRIORITY" : "MEDIUM PRIORITY",
                status: "todo",
                assignee: matchedUser ? `${matchedUser.firstName} ${matchedUser.lastName}` : assigneeName,
                source: `Meeting: ${meeting.title}`,
            });

            syncedTasks.push(createdTask);

            // If matched to a specific user, trigger a task assignment notification
            if (matchedUser) {
                await Notification.create({
                    recipient: matchedUser._id,
                    community: communityId,
                    type: "task",
                    title: "New Assigned Task",
                    message: `You have been assigned a task: "${createdTask.title}" from meeting "${meeting.title}".`,
                    relatedId: meeting._id,
                });
                console.log(`[PostMeetingPipeline] Synced task and notified assignee: ${matchedUser.email}`);
            }
        }

        // 2. Dispatch summary notifications to ALL active community members
        // Only if hosted by an admin
        const hostUser = members.find(m => m._id.toString() === (meeting.host?._id || meeting.host).toString());
        const isHostAdmin = hostUser?.role === "admin" || meeting.host?.role === "admin";

        if (isHostAdmin) {
            console.log("[PostMeetingPipeline] Host is admin — dispatching summaries to all community members.");
            for (const member of members) {
                // Avoid notifying host about summary if desired, or notify them too
                await Notification.create({
                    recipient: member._id,
                    community: communityId,
                    type: "meeting",
                    title: `Meeting Report: ${meeting.title}`,
                    message: `The meeting "${meeting.title}" has been summarized. Click here to read the recap, decisions, and tasks.`,
                    relatedId: meeting._id,
                });

                // Send HTML email digest via Resend
                await sendMeetingSummaryEmail({
                    to: member.email,
                    recipientName: `${member.firstName} ${member.lastName}`,
                    meetingTitle: meeting.title,
                    summaryText,
                    decisions,
                    tasks: syncedTasks
                });
            }
        }

        console.log("[PostMeetingPipeline] Sync pipeline finished successfully!");
    } catch (error) {
        console.error("[PostMeetingPipeline] Error in sync pipeline:", error);
    }
};
