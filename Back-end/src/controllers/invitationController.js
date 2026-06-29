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
  console.log("RESOLVING TOKEN:", token);
  if (!token) {
    console.log("TOKEN RESOLVE FAILED: token is empty");
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
    console.log("TOKEN RESOLVE FAILED: no invitation found for token");
    res.status(404).json({ success: false, message: "Invitation not found." });
    return { error: true };
  }

  console.log("TOKEN RESOLVED: id=" + invitation._id + ", email=" + invitation.email + ", status=" + invitation.status);

  if (invitation.status === "accepted") {
    console.log("TOKEN RESOLVE FAILED: invitation already accepted");
    res
      .status(400)
      .json({
        success: false,
        message: "This invitation has already been used.",
      });
    return { error: true };
  }

  if (invitation.expiresAt < new Date() || invitation.status === "expired") {
    console.log("TOKEN RESOLVE FAILED: invitation expired — expiresAt=" + invitation.expiresAt);
    if (invitation.status !== "expired") {
      invitation.status = "expired";
      await invitation.save();
      console.log("TOKEN MARKED AS EXPIRED: id=" + invitation._id);
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
  console.log("RECEIVED: POST /api/invitations — body:", req.body);
  console.log("AUTHENTICATED USER:", req.user?._id, req.user?.email);
  try {
    const { fullName, email, role } = req.body;

    if (!fullName || fullName.trim() === "") {
      console.log("VALIDATION FAILED: Full name is empty");
      return res
        .status(400)
        .json({ success: false, message: "Full name is required." });
    }
    if (fullName.trim().length < 3) {
      console.log("VALIDATION FAILED: Full name too short");
      return res
        .status(400)
        .json({
          success: false,
          message: "Full name must be at least 3 characters.",
        });
    }
    if (!/^[a-zA-Z\s'\-]+$/.test(fullName.trim())) {
      console.log("VALIDATION FAILED: Full name has invalid characters");
      return res
        .status(400)
        .json({
          success: false,
          message: "Full name can only contain letters.",
        });
    }

    if (!email || email.trim() === "") {
      console.log("VALIDATION FAILED: Email is empty");
      return res
        .status(400)
        .json({ success: false, message: "Email address is required." });
    }
    if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())
    ) {
      console.log("VALIDATION FAILED: Email format invalid —", email.trim());
      return res
        .status(400)
        .json({
          success: false,
          message: "Please enter a valid email address.",
        });
    }

    const allowedRoles = ["user", "admin"];
    if (!role || !allowedRoles.includes(role)) {
      console.log("VALIDATION FAILED: Invalid role —", role);
      return res
        .status(400)
        .json({ success: false, message: "Role must be 'user' or 'admin'." });
    }

    console.log("VALIDATION PASSED: All fields validated");

    // Community always comes from the authenticated admin — never from the request body
    const community = req.user.community;
    if (!community) {
      console.log("VALIDATION FAILED: Admin has no community");
      return res
        .status(400)
        .json({
          success: false,
          message: "Your account has no community assigned.",
        });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const communityDoc = await Community.findById(community).select("name");
    if (!communityDoc) {
      console.log("VALIDATION FAILED: Community not found —", community);
      return res
        .status(400)
        .json({ success: false, message: "Community not found." });
    }

    // Look for any existing invitation for this email + community (regardless of
    // status) so we can reuse the document instead of deleting + recreating it.
    const existingInvitation = await Invitation.findOne({
      email: normalizedEmail,
      community,
    });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    let invitation;

    if (existingInvitation) {
      console.log(
        "EXISTING INVITATION FOUND: id=" + existingInvitation._id +
        ", email=" + normalizedEmail + ", currentStatus=" + existingInvitation.status
      );

      // CASE 4 — Accepted invitation: check whether the user still exists
      if (existingInvitation.status === "accepted") {
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
          console.log(
            "RESEND BLOCKED: User is already a workspace member — email=" + normalizedEmail
          );
          return res.status(400).json({
            success: false,
            message:
              "This email address already belongs to a workspace member. Invitation cannot be resent.",
          });
        }
        console.log(
          "ACCEPTED INVITATION — USER DOCUMENT NOT FOUND: allowing resend for email=" +
          normalizedEmail
        );
      }

      // CASE 1 (pending), CASE 2 (expired), CASE 3 (rejected/other):
      // Update the existing document in place with fresh values.
      existingInvitation.token = token;
      existingInvitation.expiresAt = expiresAt;
      existingInvitation.fullName = fullName.trim();
      existingInvitation.role = role;
      existingInvitation.invitedBy = req.user._id;
      existingInvitation.status = "pending";
      await existingInvitation.save();

      invitation = existingInvitation;
      console.log(
        "INVITATION UPDATED: id=" + invitation._id +
        ", newToken=" + token + ", status=pending"
      );
    } else {
      // No existing invitation — create a brand-new document
      console.log("NO EXISTING INVITATION: creating new document for email=" + normalizedEmail);

      invitation = await Invitation.create({
        token,
        fullName: fullName.trim(),
        email: normalizedEmail,
        role,
        community,
        invitedBy: req.user._id,
        status: "pending",
        expiresAt,
      });

      console.log("INVITATION CREATED: id=" + invitation._id + ", token=" + token);
    }

    const invitationLink = `${process.env.FRONTEND_URL}/register?token=${token}`;

    console.log("INVITATION LINK: " + invitationLink);
    console.log("EMAIL SENDING STARTED: to=" + normalizedEmail + ", from=SmartMeet <onboarding@resend.dev>");

    try {
      await sendInvitationEmail({
        to: normalizedEmail,
        fullName: fullName.trim(),
        communityName: communityDoc.name,
        role,
        invitationLink,
        expiresAt,
      });

      console.log("EMAIL SENT SUCCESSFULLY: to=" + normalizedEmail);
    } catch (emailError) {
      console.error("EMAIL FAILED: to=" + normalizedEmail);
      console.error("EMAIL ERROR NAME:", emailError.name);
      console.error("EMAIL ERROR MESSAGE:", emailError.message);
      if (emailError.stack) {
        console.error("EMAIL ERROR STACK:", emailError.stack);
      }

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
    console.error("ERROR MESSAGE:", error.message);
    console.error("ERROR STACK:", error.stack);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─── GET /api/invitations/verify/:token ──────────────────────────────────────
export const verifyInvitation = async (req, res) => {
  console.log("RECEIVED: GET /api/invitations/verify/" + req.params.token);
  try {
    const { error, invitation } = await resolveToken(req.params.token, res);
    if (error) return;

    // Tell the frontend whether this email already has a SmartMeet account so it
    // can redirect to sign-in instead of showing the password-creation form.
    const existingUser = await User.findOne({ email: invitation.email });

    console.log("VERIFY SUCCESS: email=" + invitation.email + ", isExistingUser=" + !!existingUser);

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
    console.error("VERIFY INVITATION ERROR");
    console.error("ERROR MESSAGE:", error.message);
    console.error("ERROR STACK:", error.stack);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/invitations/:token/accept ─────────────────────────────────────
// Public. Called by Register.vue when a brand-new user sets their password.
export const acceptInvitation = async (req, res) => {
  try {
    const { error, invitation } = await resolveToken(req.params.token, res);
    if (error) return;

    console.log("ACCEPT INVITATION: token=" + req.params.token + ", email=" + invitation.email);

    const { password, confirmPassword } = req.body;

    // If the email was registered after the invitation was sent, redirect the
    // frontend to the login page via a specific error code.
    const existingUser = await User.findOne({ email: invitation.email });
    if (existingUser) {
      console.log("ACCEPT FAILED: Email already registered — " + invitation.email);
      return res.status(409).json({
        success: false,
        code: "EMAIL_EXISTS",
        message:
          "This email is already registered. Please sign in to accept the invitation.",
      });
    }

    if (!password) {
      console.log("ACCEPT FAILED: Password not provided");
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
      console.log("ACCEPT FAILED: Password requirements not met");
      return res
        .status(400)
        .json({
          success: false,
          message: "Password does not meet all requirements.",
        });
    }

    if (!confirmPassword) {
      console.log("ACCEPT FAILED: Confirm password not provided");
      return res
        .status(400)
        .json({ success: false, message: "Please confirm your password." });
    }
    if (password !== confirmPassword) {
      console.log("ACCEPT FAILED: Passwords do not match");
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

    console.log("REGISTRATION COMPLETED: user=" + user._id + ", email=" + user.email);

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
    console.error("ACCEPT INVITATION ERROR");
    console.error("ERROR MESSAGE:", error.message);
    console.error("ERROR STACK:", error.stack);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/invitations/:token/claim ──────────────────────────────────────
// Protected. Called by the auth store after an existing user logs in.
export const claimInvitation = async (req, res) => {
  console.log("RECEIVED: POST /api/invitations/" + req.params.token + "/claim — user=" + req.user?.email);
  try {
    const { error, invitation } = await resolveToken(req.params.token, res);
    if (error) return;

    // The logged-in user's email must match the invitation email exactly
    if (req.user.email !== invitation.email) {
      console.log("CLAIM FAILED: Email mismatch — token email=" + invitation.email + ", user email=" + req.user.email);
      return res.status(403).json({
        success: false,
        message: "This invitation was sent to a different email address.",
      });
    }

    // A user who already belongs to a community cannot be reassigned
    if (req.user.community) {
      console.log("CLAIM FAILED: User already has a community — userId=" + req.user._id);
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

    console.log("CLAIM SUCCESS: user=" + req.user._id + ", community=" + req.user.community);

    res.status(200).json({
      success: true,
      message: "Invitation accepted. Welcome to your workspace.",
      user: req.user.getPublicProfile(),
    });
  } catch (error) {
    console.error("CLAIM INVITATION ERROR");
    console.error("ERROR MESSAGE:", error.message);
    console.error("ERROR STACK:", error.stack);
    res.status(500).json({ success: false, message: error.message });
  }
};
