import express from "express";
import path from "path"
import userRoutes from "./routes/userRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import ragRoutes from "./routes/ragRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import joinRequestRoutes from "./routes/joinRequestRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import invitationRoutes from "./routes/invitationRoutes.js";
import communityChatRoutes from "./routes/communityChatRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.use(
    "/uploads",
    express.static("uploads")
);

app.get("/", (req, res) => {
    res.send("SmartMeet API Running");
});

app.use("/api/users", userRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/rag", ragRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/join-requests", joinRequestRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/invitations", invitationRoutes);
app.use("/api/community-chat", communityChatRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/subscription", subscriptionRoutes);

export default app;