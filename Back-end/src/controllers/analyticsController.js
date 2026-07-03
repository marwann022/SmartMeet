import mongoose from "mongoose";
import Meeting from "../models/Meeting.js";
import MeetingKnowledge from "../models/MeetingKnowledge.js";
import ActionItem from "../models/ActionItem.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import Community from "../models/Community.js";

export const getTeamAnalytics = async (req, res) => {
    try {
        const userId = req.user._id;
        const now = new Date();
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const isAdmin = req.user.role === "admin";
        const communityId = req.user.community;

        const communityFilter = communityId ? { community: communityId } : {};

        // 1. Team Performance & Tasks Insights
        let tasks;
        if (isAdmin) {
            tasks = await Task.find(communityFilter);
        } else {
            tasks = await Task.find({ $or: [{ user: userId }, { createdBy: userId }], ...communityFilter });
        }

        let totalTasks = tasks.length;
        let completedTasks = 0;
        let pendingTasks = 0;
        let inReviewTasks = 0;
        let overdueTasks = 0;
        let inProgressTasks = 0;
        let aiTasks = 0;
        let manualTasks = 0;
        let totalCompletionMs = 0;
        let completedTaskCount = 0;

        tasks.forEach(task => {
            if (task.status === "done") completedTasks++;
            else if (task.status === "review") inReviewTasks++;
            else if (task.status === "inprogress") inProgressTasks++;
            else pendingTasks++;

            if (task.status !== "done" && task.dueDate && new Date(task.dueDate) < now) {
                overdueTasks++;
            }

            if (task.source && task.source.toLowerCase().includes("ai")) aiTasks++;
            else manualTasks++;

            if (task.status === "done" && task.createdAt && task.updatedAt) {
                totalCompletionMs += new Date(task.updatedAt) - new Date(task.createdAt);
                completedTaskCount++;
            }
        });

        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        const performanceScore = Math.max(0, completionRate - (overdueTasks * 2));
        const avgCompletionDays = completedTaskCount > 0
            ? Math.round((totalCompletionMs / completedTaskCount / 86400000) * 10) / 10
            : 0;

        // 2. Meetings Analytics & Attendance
        const memberEmails = isAdmin ? [] : [req.user.email, req.user.name, `${req.user.firstName} ${req.user.lastName}`.trim()];

        let meetings;
        if (isAdmin) {
            meetings = await Meeting.find(communityFilter);
        } else {
            meetings = await Meeting.find({
                $or: [
                    { host: userId },
                    { "participants.email": req.user.email },
                    { "participants.name": req.user.name },
                    { "participants.name": `${req.user.firstName} ${req.user.lastName}`.trim() }
                ],
                ...communityFilter
            });
        }

        let totalMeetings = meetings.length;
        let meetingsThisWeek = 0;
        let meetingsThisMonth = 0;
        let totalMeetingMinutes = 0;
        let totalAttendees = 0;
        let aiSummaries = 0;
        let meetingsWithTasks = 0;
        let userMeetingCount = new Map();
        let userAttendedDays = new Map();
        let userEmailSet = new Set();

        const allMeetingIds = meetings.map(m => m._id);

        // Count meetings that have action items
        if (allMeetingIds.length > 0) {
            const meetingIdsWithTasks = await ActionItem.distinct("meeting", { meeting: { $in: allMeetingIds } });
            meetingsWithTasks = meetingIdsWithTasks.length;
        }

        meetings.forEach(m => {
            if (m.startTime >= startOfWeek) meetingsThisWeek++;
            if (m.startTime >= startOfMonth) meetingsThisMonth++;
            if (m.duration) {
                totalMeetingMinutes += m.duration;
                aiSummaries++;
            }
            if (m.participants) {
                totalAttendees += m.participants.length;
                m.participants.forEach(p => {
                    const key = p.email || p.name;
                    if (key) {
                        userEmailSet.add(key);
                        userMeetingCount.set(key, (userMeetingCount.get(key) || 0) + 1);
                        if (m.startTime) {
                            const day = new Date(m.startTime).toISOString().split("T")[0];
                            if (!userAttendedDays.has(key)) userAttendedDays.set(key, new Set());
                            userAttendedDays.get(key).add(day);
                        }
                    }
                });
            }
        });

        const avgMeetingDuration = totalMeetings > 0 ? Math.round(totalMeetingMinutes / totalMeetings) : 0;
        const totalMeetingHours = Math.round((totalMeetingMinutes / 60) * 10) / 10;
        const avgAttendees = totalMeetings > 0 ? Math.round(totalAttendees / totalMeetings) : 0;

        // 3. Community Activity
        const communities = await Community.find({ $or: [{ owner: userId }, { _id: communityId }] });
        const communityIds = communities.map(c => c._id);

        // 4. Top Contributors
        const activeMembers = await User.find({
            community: { $in: communityIds },
            role: "user",
            status: "active"
        }).select("firstName lastName email avatar");

        let allUserTasks = [];
        if (isAdmin && communityId) {
            allUserTasks = await Task.aggregate([
                { $match: { community: communityId, user: { $ne: null } } },
                { $group: { _id: "$user", total: { $sum: 1 }, done: { $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] } } } }
            ]);
        }
        const taskStatsByUser = new Map();
        allUserTasks.forEach(t => taskStatsByUser.set(t._id.toString(), t));

        let totalMeetingParticipation = 0;
        userMeetingCount.forEach(count => { totalMeetingParticipation += count; });

        let contributorsMap = new Map();
        activeMembers.forEach(member => {
            const email = member.email;
            const meetingCount = userMeetingCount.get(email) || 0;
            const userTaskStats = taskStatsByUser.get(member._id.toString());
            const memberCompletedTasks = userTaskStats?.done || 0;
            const memberTotalTasks = userTaskStats?.total || 0;
            const memberCompletionRate = memberTotalTasks > 0 ? Math.round((memberCompletedTasks / memberTotalTasks) * 100) : 0;

            contributorsMap.set(email, {
                name: `${member.firstName} ${member.lastName || ""}`.trim(),
                email,
                avatar: member.avatar || null,
                score: (meetingCount * 10) + memberCompletionRate,
                completionRate: memberCompletionRate,
                role: "Member"
            });
        });

        meetings.forEach(m => {
            if (m.participants) {
                m.participants.forEach(p => {
                    if (p.email && contributorsMap.has(p.email)) {
                        contributorsMap.get(p.email).score += 5;
                    }
                });
            }
        });

        const topContributors = Array.from(contributorsMap.values())
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

        // 5. Attendance Calculation
        let attendedMeetingsCount = 0;
        let totalPossibleAttendance = 0;
        let bestAttendeeName = "N/A";
        let bestAttendeeCount = 0;
        let maxStreak = 0;

        meetings.forEach(m => {
            totalPossibleAttendance++;
            if (m.participants) {
                const attended = m.participants.some(p =>
                    p.email === req.user.email ||
                    p.name === req.user.name ||
                    p.name === `${req.user.firstName} ${req.user.lastName}`.trim()
                );
                if (attended) attendedMeetingsCount++;
            }
        });

        userMeetingCount.forEach((count, key) => {
            if (count > bestAttendeeCount) {
                bestAttendeeCount = count;
                const member = activeMembers.find(m => m.email === key);
                bestAttendeeName = member ? `${member.firstName} ${member.lastName || ""}`.trim() : key;
            }
        });

        // Calculate consecutive streak from meeting attendance days
        userAttendedDays.forEach((days) => {
            const sortedDays = Array.from(days).sort();
            let streak = 1;
            let currentStreak = 1;
            for (let i = 1; i < sortedDays.length; i++) {
                const prev = new Date(sortedDays[i - 1]);
                const curr = new Date(sortedDays[i]);
                const diffDays = Math.round((curr - prev) / 86400000);
                if (diffDays === 1) {
                    currentStreak++;
                    if (currentStreak > streak) streak = currentStreak;
                } else {
                    currentStreak = 1;
                }
            }
            if (streak > maxStreak) maxStreak = streak;
        });

        const overallAttendanceRate = totalPossibleAttendance > 0
            ? Math.round((attendedMeetingsCount / totalPossibleAttendance) * 100)
            : 0;

        // 6. AI Usage Insights
        let totalKnowledgeDocs = 0;
        if (allMeetingIds.length > 0) {
            totalKnowledgeDocs = await MeetingKnowledge.countDocuments({ meeting: { $in: allMeetingIds } });
        }

        const aiUsage = {
            summariesGenerated: totalKnowledgeDocs,
            actionItemsExtracted: aiTasks,
            tasksCreated: aiTasks,
            hoursSaved: Math.round((totalKnowledgeDocs * 0.5) * 10) / 10,
            activeWorkspace: communities.length > 0 ? communities[0].name : "Personal Workspace"
        };

        // 7. Community Engagement
        const communityMessageCount = 0;

        const activeMemberCount = contributorsMap.size;
        const totalExpectedMembers = activeMemberCount;
        const engagementRate = totalExpectedMembers > 0
            ? Math.min(100, Math.round((activeMemberCount / Math.max(totalExpectedMembers, 1)) * 100))
            : 0;

        res.status(200).json({
            success: true,
            analytics: {
                isMemberView: !isAdmin,
                kpi: {
                    totalMembers: contributorsMap.size,
                    totalMeetings,
                    tasksCompleted: completedTasks,
                    pendingTasks,
                    aiSummaries: totalKnowledgeDocs,
                    communityMessages: communityMessageCount,
                    completionRate,
                    totalMeetingHours
                },
                teamPerformance: {
                    totalTasks,
                    completedTasks,
                    completionRate,
                    overdueTasks,
                    inProgressTasks,
                    avgCompletionTime: avgCompletionDays > 0 ? `${avgCompletionDays} days` : "N/A",
                    performanceScore
                },
                meetings: {
                    totalMeetings,
                    meetingsThisWeek,
                    meetingsThisMonth,
                    totalMeetingHours,
                    avgMeetingDuration,
                    avgAttendees,
                    aiSummaries: totalKnowledgeDocs,
                    meetingsWithTasks
                },
                topContributors,
                tasksInsights: {
                    totalTasks,
                    completed: completedTasks,
                    pending: pendingTasks,
                    inReview: inReviewTasks,
                    overdue: overdueTasks,
                    aiGenerated: aiTasks,
                    manual: manualTasks
                },
                recentTasks: tasks.sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now())).slice(0, 5),
                attendance: {
                    overallRate: overallAttendanceRate,
                    bestMember: bestAttendeeName,
                    lowestMember: topContributors[topContributors.length - 1]?.name || bestAttendeeName,
                    missedMeetings: totalPossibleAttendance - attendedMeetingsCount,
                    consecutiveStreak: maxStreak,
                    absentToday: 0
                },
                aiUsage,
                community: {
                    messagesToday: communityMessageCount,
                    activeMembers: activeMemberCount,
                    mostActiveMember: bestAttendeeName,
                    engagementRate
                }
            }
        });

    } catch (error) {
        console.error("Team Analytics Error:", error);
        res.status(500).json({ success: false, message: "Server Error fetching team analytics" });
    }
};
