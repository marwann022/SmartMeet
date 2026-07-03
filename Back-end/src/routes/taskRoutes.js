import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getTasks, createTask, updateTask, approveTask, rejectTask, deleteTask } from "../controllers/taskController.js";

const router = express.Router();

// Apply auth middleware to protect all routes under this router
router.use(protect);

router.route("/")
    .get(getTasks)
    .post(createTask);

router.route("/:id")
    .put(updateTask)
    .delete(deleteTask);

router.put("/:id/approve", approveTask);
router.put("/:id/reject", rejectTask);

export default router;
