import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  createInvitation,
  verifyInvitation,
  acceptInvitation,
  claimInvitation,
} from "../controllers/invitationController.js";

const router = express.Router();

// Admin-only: create and send an invitation
router.post("/", protect, adminOnly, createInvitation);

// Public: verify a token before showing the registration form
router.get("/verify/:token", verifyInvitation);

// Public: new user sets their password and creates their account
router.post("/:token/accept", acceptInvitation);

// Protected: existing user claims an invitation after signing in
router.post("/:token/claim", protect, claimInvitation);

export default router;
