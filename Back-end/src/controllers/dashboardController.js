import Meeting from "../models/Meeting.js";
import Task from "../models/Task.js";

// @desc    Get dashboard summary stats
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const startOfLastWeek = new Date(startOfWeek);
        startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

        // Meetings count for this week
        const meetingsThisWeek = await Meeting.countDocuments({
            host: userId,
            startTime: { $gte: startOfWeek }
        });

        // Tasks completed this week vs last week to calculate productivity
        const tasksCompletedThisWeek = await Task.countDocuments({
            user: userId,
            status: "done",
            updatedAt: { $gte: startOfWeek }
        });

        const tasksCompletedLastWeek = await Task.countDocuments({
            user: userId,
            status: "done",
            updatedAt: { $gte: startOfLastWeek, $lt: startOfWeek }
        });

        let productivityChange = 0;
        if (tasksCompletedLastWeek > 0) {
            productivityChange = Math.round(((tasksCompletedThisWeek - tasksCompletedLastWeek) / tasksCompletedLastWeek) * 100);
        } else if (tasksCompletedThisWeek > 0) {
            productivityChange = 100; // 100% up if last week was 0
        }

        res.status(200).json({
            success: true,
            stats: {
                meetingsThisWeek,
                tasksCompletedThisWeek,
                productivityChange,
            }
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ success: false, message: "Server Error fetching dashboard stats" });
    }
};

// @desc    Get dashboard activity chart data
// @route   GET /api/dashboard/chart
// @access  Private
export const getActivityChart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { period = "week" } = req.query; // 'week' or 'month'

        const now = new Date();
        const numDays = period === "month" ? 30 : 7;
        const startDate = new Date();
        startDate.setDate(now.getDate() - numDays + 1);
        startDate.setHours(0, 0, 0, 0);

        // Aggregate completed tasks by day
        const taskAggregation = await Task.aggregate([
            {
                $match: {
                    user: userId,
                    status: "done",
                    updatedAt: { $gte: startDate, $lte: now }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Map aggregated data into an array of { label, value }
        const chartData = [];
        const taskMap = new Map();
        taskAggregation.forEach(item => {
            taskMap.set(item._id, item.count);
        });

        let maxCount = 0;
        for (let i = 0; i < numDays; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const dateStr = date.toISOString().split("T")[0];
            const count = taskMap.get(dateStr) || 0;
            if (count > maxCount) maxCount = count;
            
            let label = "";
            if (period === "week") {
                const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                label = days[date.getDay()];
            } else {
                label = date.getDate().toString();
            }

            chartData.push({ label, count, date: dateStr });
        }

        // Normalize values to percentages (0 to 100) for the frontend chart bars
        const maxBarValue = maxCount > 0 ? maxCount : 1;
        const normalizedData = chartData.map(d => ({
            label: d.label,
            value: Math.round((d.count / maxBarValue) * 100)
        }));

        res.status(200).json({
            success: true,
            period,
            chartData: normalizedData
        });
    } catch (error) {
        console.error("Dashboard Chart Error:", error);
        res.status(500).json({ success: false, message: "Server Error fetching chart data" });
    }
};

// @desc    Get dashboard AI Insights
// @route   GET /api/dashboard/insights
// @access  Private
export const getInsights = async (req, res) => {
    try {
        const userId = req.user._id;
        const now = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(now.getDate() + 1);

        const insights = [];

        // Insight 1: Meeting Burnout Risk (if > 3 meetings today or tomorrow)
        const upcomingMeetings = await Meeting.countDocuments({
            host: userId,
            startTime: { $gte: now, $lte: tomorrow }
        });

        if (upcomingMeetings >= 3) {
            insights.push({
                type: "MEETING BURNOUT RISK",
                color: "secondary", // mapping to UI classes
                text: `You have ${upcomingMeetings} meetings scheduled shortly. AI suggests blocking off a 15-minute gap to recharge.`
            });
        }

        // Insight 2: Overdue Tasks
        const overdueTasks = await Task.countDocuments({
            user: userId,
            status: { $ne: "done" },
            dueDate: { $ne: "", $lt: now.toISOString().split("T")[0] }
        });

        if (overdueTasks > 0) {
            insights.push({
                type: "TASK DEADLINES",
                color: "red",
                text: `You have ${overdueTasks} overdue tasks. Prioritize clearing them today to keep your workflow on track.`
            });
        }

        // Default positive insight if no warnings
        if (insights.length === 0) {
            insights.push({
                type: "CONCENTRATION PEAK",
                color: "primary",
                text: "Your schedule looks clear! This is a great time for deep work sessions and focused productivity."
            });
        }

        res.status(200).json({
            success: true,
            insights
        });
    } catch (error) {
        console.error("Dashboard Insights Error:", error);
        res.status(500).json({ success: false, message: "Server Error fetching insights" });
    }
};
