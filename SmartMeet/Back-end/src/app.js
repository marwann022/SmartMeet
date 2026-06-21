import express from "express";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("SmartMeet API Running");
});

app.use("/api/users", userRoutes);

export default app;