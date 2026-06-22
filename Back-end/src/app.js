import express from "express";
import path from "path"
import userRoutes from "./routes/userRoutes.js";
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

export default app;