import crypto from "crypto";
import Invitation from "../models/Invitation.js";
import User from "../models/User.js";
import Community from "../models/Community.js";
import { sendInvitationEmail } from "../services/emailService.js";
import generateToken from "../utils/generateToken.js";
import Session from "../models/Session.js";
import { UAParser } from "ua-parser-js";

// ─── Shared helper ────────────────────────────────────────────────────────────
// Validates a token string, resolves the Invitation document, and returns an
// error response if the token is missing, not found, already used, or expired.
// Returns { invitation } on success or { error: true } after sending the response.
const resolveToken = async (token, res) => {
  if (!token) {
    res
      .status(400)
      .json({ success: false, message: "Invitation token is required." });
    return { error: true };
  }

  const invitation = await Invitation.findOne({ token }).populate(
    "community",
    "name",
  );

  if (!invitation) {
    res.status(404).json({ success: false, message: "Invitation not found." });
    return { error: true };
  }

  if (invitation.status === "accepted") {
    res
      .status(400)
      .json({
        success: false,
        message: "This invitation has already been used.",
      });
    return { error: true };
  }

  if (invitation.expiresAt < new Date() || invitation.status === "expired") {
    if (invitation.status !== "expired") {
      invitation.status = "expired";
      await invitation.save();
    }
    res
      .status(400)
      .json({ success: false, message: "This invitation has expired." });
    return { error: true };
  }

  return { invitation };
};

// ─── POST /api/invitations ────────────────────────────────────────────────────
export const createInvitation = async (req, res) => {
  console.log("========== CREATE INVITATION ==========");
  try {
    const { fullName, email, role } = req.body;

    console.log("Request body:", req.body);
    console.log("Authenticated user:", req.user);

    if (!fullName || fullName.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Full name is required." });
    }
    if (fullName.trim().length < 3) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Full name must be at least 3 characters.",
        });
    }
    if (!/^[a-zA-Z\s'\-]+$/.test(fullName.trim())) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Full name can only contain letters.",
        });
    }

    if (!email || email.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Email address is required." });
    }
    if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Please enter a valid email address.",
        });
    }

    const allowedRoles = ["user", "admin"];
    if (!role || !allowedRoles.includes(role)) {
      return res
        .status(400)
        .json({ success: false, message: "Role must be 'user' or 'admin'." });
    }

    // Community always comes from the authenticated admin — never from the request body
    const community = req.user.community;
    if (!community) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Your account has no community assigned.",
        });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Prevent duplicate live invitations for the same email in the same community
    const existingInvitation = await Invitation.findOne({
      email: normalizedEmail,
      community,
      status: "pending",
      expiresAt: { $gt: new Date() },
    });
    console.log("Existing invitation:", existingInvitation);
    if (existingInvitation) {
      return res.status(409).json({
        success: false,
        message: "A pending invitation already exists for this email address.",
      });
    }

    const communityDoc = await Community.findById(community).select("name");
    if (!communityDoc) {
      return res
        .status(400)
        .json({ success: false, message: "Community not found." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    console.log("Creating invitation...");

    const invitation = await Invitation.create({
      token,
      fullName: fullName.trim(),
      email: normalizedEmail,
      role,
      community,
      invitedBy: req.user._id,
      status: "pending",
      expiresAt,
    });

    console.log("Invitation created:", invitation);

    const invitationLink = `${process.env.FRONTEND_URL}/register?token=${token}`;

    try {
      console.log("Sending email...");

      await sendInvitationEmail({
        to: normalizedEmail,
        fullName: fullName.trim(),
        communityName: communityDoc.name,
        role,
        invitationLink,
        expiresAt,
      });

      console.log("Email sent successfully.");
    } catch (emailError) {
      console.error("EMAIL ERROR:");
      console.error(emailError);

      return res.status(202).json({
        success: false,
        message:
          "Invitation saved but the email could not be sent. Share the link manually.",
        invitationLink,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Invitation sent successfully.",
      invitationLink,
    });
  } catch (error) {
    console.error("CREATE INVITATION ERROR");
    console.error(error);
    console.error(error.stack);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─── GET /api/invitations/verify/:token ──────────────────────────────────────
export const verifyInvitation = async (req, res) => {
  try {
    const { error, invitation } = await resolveToken(req.params.token, res);
    if (error) return;

    // Tell the frontend whether this email already has a SmartMeet account so it
    // can redirect to sign-in instead of showing the password-creation form.
    const existingUser = await User.findOne({ email: invitation.email });

    res.status(200).json({
      success: true,
      invitation: {
        fullName: invitation.fullName,
        email: invitation.email,
        role: invitation.role,
        communityName: invitation.community ? invitation.community.name : "",
        isExistingUser: !!existingUser,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/invitations/:token/accept ─────────────────────────────────────
// Public. Called by Register.vue when a brand-new user sets their password.
export const acceptInvitation = async (req, res) => {
  try {
    const { error, invitation } = await resolveToken(req.params.token, res);
    if (error) return;

    const { password, confirmPassword } = req.body;

    // If the email was registered after the invitation was sent, redirect the
    // frontend to the login page via a specific error code.
    const existingUser = await User.findOne({ email: invitation.email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        code: "EMAIL_EXISTS",
        message:
          "This email is already registered. Please sign in to accept the invitation.",
      });
    }

    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Password is required." });
    }

    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);
    const min8 = password.length >= 8;

    if (!hasLowercase || !hasUppercase || !hasNumber || !hasSpecial || !min8) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password does not meet all requirements.",
        });
    }

    if (!confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Please confirm your password." });
    }
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match." });
    }

    const names = invitation.fullName.trim().split(/\s+/);
    const firstName = names[0];
    const lastName = names.slice(1).join(" ") || "";

    // Create the user — immediately active with community and role already assigned
    const user = await User.create({
      name: invitation.fullName.trim(),
      firstName,
      lastName,
      email: invitation.email,
      password,
      role: invitation.role,
      community: invitation.community._id,
      status: "active",
    });

    invitation.status = "accepted";
    await invitation.save();

    const jwtToken = generateToken(user._id);

    // Session creation is best-effort — it must not block the response
    try {
      const parser = new UAParser(req.headers["user-agent"]);
      const deviceInfo = parser.getResult();
      await Session.create({
        user: user._id,
        refreshToken: jwtToken,
        browser: deviceInfo.browser.name || "Unknown",
        browserVersion: deviceInfo.browser.version || "",
        os: deviceInfo.os.name || "Unknown",
        osVersion: deviceInfo.os.version || "",
        device: deviceInfo.device.model || "Desktop",
        deviceType: deviceInfo.device.type || "desktop",
        ip: req.ip,
        lastActive: new Date(),
      });
    } catch (_) {
      // non-fatal
    }

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token: jwtToken,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/invitations/:token/claim ──────────────────────────────────────
// Protected. Called by the auth store after an existing user logs in.
export const claimInvitation = async (req, res) => {
  try {
    const { error, invitation } = await resolveToken(req.params.token, res);
    if (error) return;

    // The logged-in user's email must match the invitation email exactly
    if (req.user.email !== invitation.email) {
      return res.status(403).json({
        success: false,
        message: "This invitation was sent to a different email address.",
      });
    }

    // A user who already belongs to a community cannot be reassigned
    if (req.user.community) {
      return res.status(409).json({
        success: false,
        message: "You are already a member of a community.",
      });
    }

    req.user.community = invitation.community._id;
    req.user.role = invitation.role;
    req.user.status = "active";
    await req.user.save();

    invitation.status = "accepted";
    await invitation.save();

    res.status(200).json({
      success: true,
      message: "Invitation accepted. Welcome to your workspace.",
      user: req.user.getPublicProfile(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
