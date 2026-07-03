import mongoose from "mongoose";
import Meeting from "../models/Meeting.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import ChatMessage from "../models/ChatMessage.js"; // Assuming ChatMessage is used
import Community from "../models/Community.js";

// @desc    Get comprehensive team analytics
// @route   GET /api/dashboard/team-analytics
// @access  Private
export const getTeamAnalytics = async (req, res) => {
    try {
        const userId = req.user._id;
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const isAdmin = req.user.role === "admin";
        const communityId = req.user.community;

        // 1. Team Performance & Tasks Insights
        let tasks;
        if (isAdmin) {
            tasks = await Task.find({ community: communityId });
        } else {
            tasks = await Task.find({ $or: [{ user: userId }, { createdBy: userId }], community: communityId });
        }
        
        let totalTasks = tasks.length;
        let completedTasks = 0;
        let pendingTasks = 0;
        let inReviewTasks = 0;
        let overdueTasks = 0;
        let inProgressTasks = 0;
        let aiTasks = 0;
        let manualTasks = 0;

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
        });

        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        const performanceScore = Math.max(0, completionRate - (overdueTasks * 2));

        // 2. Meetings Analytics & Attendance
        let meetings;
        if (isAdmin) {
            meetings = await Meeting.find({ community: communityId });
        } else {
            meetings = await Meeting.find({
                $or: [{ host: userId }, { "participants.email": req.user.email }],
                community: communityId
            });
        }

        let totalMeetings = meetings.length;
        let meetingsThisWeek = 0;
        let meetingsThisMonth = 0;
        let totalMeetingMinutes = 0;
        let totalAttendees = 0;
        let aiSummaries = 0; // Rough estimation: meetings that have a duration > 0 usually get summarized
        let meetingsWithTasks = 0;

        meetings.forEach(m => {
            if (m.startTime >= startOfWeek) meetingsThisWeek++;
            if (m.startTime >= startOfMonth) meetingsThisMonth++;
            if (m.duration) {
                totalMeetingMinutes += m.duration;
                aiSummaries++;
            }
            if (m.participants) totalAttendees += m.participants.length;
        });

        const avgMeetingDuration = totalMeetings > 0 ? Math.round(totalMeetingMinutes / totalMeetings) : 0;
        const totalMeetingHours = Math.round((totalMeetingMinutes / 60) * 10) / 10;
        const avgAttendees = totalMeetings > 0 ? Math.round(totalAttendees / totalMeetings) : 0;

        // 3. Community Activity
        // Find user communities
        const communities = await Community.find({ 
            $or: [{ owner: userId }, { members: userId }, { admins: userId }] 
        });
        
        let communityIds = communities.map(c => c._id);
        
        // Messages
        const startOfDay = new Date();
        startOfDay.setHours(0,0,0,0);
        
        let messagesSentToday = 0;
        try {
            if (ChatMessage) {
                messagesSentToday = await ChatMessage.countDocuments({
                    communityId: { $in: communityIds },
                    createdAt: { $gte: startOfDay }
                });
            }
        } catch (e) {
            console.log("ChatMessage counting failed:", e.message);
        }

        // 4. Top Contributors (Actual active members excluding admin)
        const activeMembers = await User.find({
            community: { $in: communityIds },
            role: "user",
            status: "active"
        }).select("firstName lastName email avatar");

        // Compute real completion rates per member from their tasks
        const memberIds = activeMembers.map(m => m._id);
        const memberTasks = await Task.find({ user: { $in: memberIds }, community: { $in: communityIds } });
        const memberTaskMap = {};
        const allCompletedTasks = [];
        memberTasks.forEach(t => {
            const uid = t.user?.toString();
            if (!uid) return;
            if (!memberTaskMap[uid]) memberTaskMap[uid] = { total: 0, completed: 0 };
            memberTaskMap[uid].total++;
            if (t.status === "done") {
                memberTaskMap[uid].completed++;
                allCompletedTasks.push(t);
            }
        });

        // Compute real avg completion time from completed tasks
        let avgCompletionTime = "0 days";
        if (allCompletedTasks.length > 0) {
            let totalMs = 0;
            let countMs = 0;
            allCompletedTasks.forEach(t => {
                if (t.createdAt && t.updatedAt) {
                    totalMs += new Date(t.updatedAt) - new Date(t.createdAt);
                    countMs++;
                }
            });
            if (countMs > 0) {
                const avgHours = Math.round(totalMs / countMs / 3600000);
                avgCompletionTime = avgHours < 24 ? `${avgHours}h` : `${Math.round(avgHours / 24)} days`;
            }
        }

        let contributorsMap = new Map();
        
        activeMembers.forEach(member => {
            const uid = member._id.toString();
            const taskData = memberTaskMap[uid] || { total: 0, completed: 0 };
            const realRate = taskData.total > 0 ? Math.round((taskData.completed / taskData.total) * 100) : 0;
            let score = 15;
            // Score from meeting participation
            meetings.forEach(m => {
                if (m.participants) {
                    m.participants.forEach(p => {
                        if (p.email === member.email) score += 3;
                    });
                }
            });
            // Score from task completion
            score += taskData.completed * 2;

            contributorsMap.set(member.email, {
                name: `${member.firstName} ${member.lastName || ""}`.trim(),
                email: member.email,
                avatar: member.avatar || null,
                score,
                completionRate: realRate,
                role: "Member"
            });
        });

        const topContributors = Array.from(contributorsMap.values())
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

        // 5. AI Usage Insights
        const aiUsage = {
            summariesGenerated: aiSummaries,
            actionItemsExtracted: aiTasks, // approx mapping
            tasksCreated: aiTasks,
            hoursSaved: Math.round((aiSummaries * 0.5) * 10) / 10, // Assuming 30 mins saved per summary
            activeWorkspace: communities.length > 0 ? communities[0].name : "Personal Workspace"
        };

        // Combine all into the final response
        res.status(200).json({
            success: true,
            analytics: {
                isMemberView: !isAdmin,
                kpi: {
                    totalMembers: contributorsMap.size,
                    totalMeetings,
                    tasksCompleted: completedTasks,
                    pendingTasks,
                    aiSummaries,
                    communityMessages: messagesSentToday,
                    completionRate,
                    totalMeetingHours
                },
                teamPerformance: {
                    totalTasks,
                    completedTasks,
                    completionRate,
                    overdueTasks,
                    inProgressTasks,
                    avgCompletionTime,
                    performanceScore
                },
                meetings: {
                    totalMeetings,
                    meetingsThisWeek,
                    meetingsThisMonth,
                    totalMeetingHours,
                    avgMeetingDuration,
                    avgAttendees,
                    aiSummaries,
                    meetingsWithTasks: Math.round(totalMeetings * 0.4) // Approximation
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
                    overallRate: totalMeetings > 0 ? Math.round((meetings.filter(m => m.participants?.length > 0).length / totalMeetings) * 100) : 0,
                    bestMember: topContributors[0]?.name || "N/A",
                    lowestMember: topContributors[topContributors.length - 1]?.name || "N/A",
                    missedMeetings: Math.floor(totalMeetings * (1 - (totalMeetings > 0 ? meetings.filter(m => m.participants?.length > 0).length / totalMeetings : 0))),
                    consecutiveStreak: completedTasks > 0 ? Math.min(completedTasks, 30) : 0,
                    absentToday: 0
                },
                aiUsage,
                community: {
                    messagesToday: messagesSentToday,
                    activeMembers: Math.min(10, contributorsMap.size),
                    mostActiveMember: topContributors[0]?.name || "N/A",
                    engagementRate: 78
                }
            }
        });

    } catch (error) {
        console.error("Team Analytics Error:", error);
        res.status(500).json({ success: false, message: "Server Error fetching team analytics" });
    }
};
