import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

import sendEmail from "../utils/sendEmail.js";

import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";

import speakeasy from "speakeasy";
import QRCode from "qrcode";

import Session from "../models/Session.js";
import { UAParser } from "ua-parser-js";

const googleClient = new OAuth2Client();

// ---------------- Register ----------------
export const register = async(req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // 1. Plain-Text Checks
        // Full Name Validation
        if (!name || name.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Full Name is required.",
            });
        }
        if (!/^[a-zA-Z\s'\-]+$/.test(name)) {
            return res.status(400).json({
                success: false,
                message: "Name can only contain letters.",
            });
        }
        if (name.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: "Name must be at least 3 characters.",
            });
        }

        // Email Validation
        if (!email || email.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Email address is required.",
            });
        }
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address.",
            });
        }

        // Password Validation
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required.",
            });
        }
        if (password.length < 3) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 3 characters.",
            });
        }

        // Password checklist strength requirements
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[^a-zA-Z0-9]/.test(password);
        const min8 = password.length >= 8;

        if (!hasLowercase || !hasUppercase || !hasNumber || !hasSpecial || !min8) {
            return res.status(400).json({
                success: false,
                message: "Password does not meet all requirements.",
            });
        }

        // Confirm Password Validation
        if (!confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Please confirm your password.",
            });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match.",
            });
        }

        // 2. Duplicate Check
        const existingUser = await User.findOne({
            email: email.toLowerCase(),
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email address already registered.",
            });
        }

        // 4. Persist
        const names = name.trim().split(/\s+/);
        const firstName = names[0];
        const lastName = names.slice(1).join(" ") || "";

        const user = await User.create({
            name: name.trim(),
            firstName,
            lastName,
            email,
            password,
        });

        // Generate JWT
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: user.getPublicProfile(),
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ---------------- Login ----------------
export const login = async(req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || email.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Email Address is required.",
            });
        }
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
            });
        }
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required",
            });
        }

        // 1. Lookup
        const user = await User.findOne({
            email: email.toLowerCase(),
        }).select("+password");

        // User not found
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Email not found. Please sign up first.",
            });
        }

        // 2. Verification
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password",
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        const parser = new UAParser(req.headers["user-agent"]);

        const deviceInfo = parser.getResult();
        console.log(deviceInfo);

        // Generate JWT
        const token = generateToken(user._id);

        console.log("Creating session...");
        // await Session.create({
        //     user: user._id,

        //     refreshToken: token,

        //     browser: deviceInfo.browser.name || "Unknown",

        //     browserVersion: deviceInfo.browser.version || "",

        //     os: deviceInfo.os.name || "Unknown",

        //     osVersion: deviceInfo.os.version || "",

        //     device: deviceInfo.device.model || "Desktop",

        //     deviceType: deviceInfo.device.type || "desktop",

        //     ip: req.ip,

        //     lastActive: new Date()
        // });
        console.log("Before Session.create");

        let session;

        try {

            const session = await Session.create({

                user: user._id,

                refreshToken: token,

                browser: deviceInfo.browser.name || "Unknown",

                browserVersion: deviceInfo.browser.version || "",

                os: deviceInfo.os.name || "Unknown",

                osVersion: deviceInfo.os.version || "",

                device: deviceInfo.device.model || "Desktop",

                deviceType: deviceInfo.device.type || "desktop",

                ip: req.ip,

                lastActive: new Date()

            });

            console.log("Session Saved Successfully");

            console.log(session);
            const count = await Session.countDocuments();

            console.log("Total Sessions:", count);

            const sessions = await Session.find();

            console.log("All Sessions:");

            console.log(sessions);

        } catch (err) {

            console.error("SESSION CREATE ERROR:");

            console.error(err);

        }



        console.log("Session created successfully");

        res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            sessionId: session ? session._id : null,
            user: user.getPublicProfile(),
        });

    } catch (error) {

        console.error("LOGIN ERROR:");
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ---------------- Google Login ----------------
export const googleLogin = async(req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "No Google token provided",
            });
        }

        const clientId = process.env.GOOGLE_CLIENT_ID;
        if (!clientId || clientId === "your_google_client_id_here") {
            return res.status(500).json({
                success: false,
                message: "Backend Google Client ID is not configured. Please set GOOGLE_CLIENT_ID in the .env file.",
            });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: clientId,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, given_name: firstName, family_name: lastName, picture: avatar } = payload;

        // Find user by Google ID or by Email
        let user = await User.findOne({
            $or: [
                { googleId },
                { email: email.toLowerCase() }
            ]
        });

        if (user) {
            // If user exists but googleId is not linked yet
            if (!user.googleId) {
                user.googleId = googleId;
            }
            // Ensure they have name set if missing
            if (!user.name) {
                user.name = `${user.firstName || firstName} ${user.lastName || lastName}`.trim();
            }
            // Update avatar if they don't have one
            if (!user.avatar && avatar) {
                user.avatar = avatar;
            }
            user.lastLogin = new Date();
            await user.save();
        } else {
            // Create user
            const fullName = `${firstName || "Google"} ${lastName || "User"}`.trim();
            user = await User.create({
                name: fullName,
                firstName: firstName || "Google",
                lastName: lastName || "User",
                email: email.toLowerCase(),
                googleId,
                avatar: avatar || "",
            });
        }

        // Generate JWT
        const localToken = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: "Login Successful via Google",
            token: localToken,
            user: user.getPublicProfile(),
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//---------------------forget password----------------------------
export const forgotPassword = async(req, res) => {
    try {
        console.log("FORGOT PASSWORD HIT");
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase(),
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email",
            });
        }

        const resetToken =
            crypto.randomBytes(32).toString("hex");

        user.resetPasswordToken = resetToken;

        user.resetPasswordExpire =
            Date.now() + 10 * 60 * 1000;

        await user.save();

        const resetUrl =
            `http://localhost:5173/reset-password/${resetToken}`;



        await sendEmail({
            to: user.email,
            subject: "SmartMeet Password Reset",
            html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Password Reset Request</h2>

          <p>Hello ${user.firstName},</p>

          <p>
            We received a request to reset your password.
          </p>

          <p>
            This email confirms that the request was received.
          </p>

          <p>
  Click the button below to reset your password:
</p>

<div style="margin:20px 0;">
  <a
    href="${resetUrl}"
    style="
      background:#2563eb;
      color:white;
      padding:12px 20px;
      text-decoration:none;
      border-radius:6px;
      display:inline-block;
      font-weight:bold;
    "
  >
    Reset Password
  </a>
</div>

<p>
  This link expires in 10 minutes.
</p>

<p>
  Or copy this link:
</p>

<p>
  ${resetUrl}
</p>

          <br/>

          <p>
            SmartMeet Team
          </p>
        </div>
      `,
        });

        res.status(200).json({
            success: true,
            message: "Password reset email sent successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};




export const resetPassword = async(req, res) => {
    try {

        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required"
            });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() }
        }).select("+password");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired token"
            });
        }

        user.password = password;

        user.resetPasswordToken = null;

        user.resetPasswordExpire = null;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });


        res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}



//---------------------profile----------------------

export const getProfile = async(req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


//---------------------update profile----------------------
export const updateProfile = async(req, res) => {
    try {

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.firstName =
            req.body.firstName || user.firstName;

        user.lastName =
            req.body.lastName || user.lastName;

        user.phone =
            req.body.phone || user.phone;

        user.company =
            req.body.company || user.company;

        user.jobTitle =
            req.body.jobTitle || user.jobTitle;

        user.avatar =
            req.body.avatar || user.avatar;

        user.twoFactor =
            req.body.twoFactor;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile Updated",
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//--------------------------chnge password--------------------
export const changePassword = async(
    req,
    res
) => {
    try {

        const {
            currentPassword,
            newPassword
        } = req.body;

        if (!currentPassword ||
            !newPassword
        ) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required"
            });
        }

        // Password checklist strength requirements
        const hasLowercase = /[a-z]/.test(newPassword);
        const hasUppercase = /[A-Z]/.test(newPassword);
        const hasNumber = /[0-9]/.test(newPassword);
        const hasSpecial = /[^a-zA-Z0-9]/.test(newPassword);
        const min8 = newPassword.length >= 8;

        if (!hasLowercase ||
            !hasUppercase ||
            !hasNumber ||
            !hasSpecial ||
            !min8
        ) {
            return res.status(400).json({
                success: false,
                message: "Password does not meet all requirements."
            });
        }

        if (currentPassword === newPassword) {
            return res.status(400).json({
                success: false,
                message: "New password must be different from current password"
            });
        }

        const user =
            await User.findById(
                req.user.id
            ).select("+password");

        if (!user.password) {
            return res.status(400).json({
                success: false,
                message: "This account uses Google Sign In"
            });
        }

        const isMatch =
            await user.matchPassword(
                currentPassword
            );

        if (!user.password) {
            return res.status(400).json({
                success: false,
                message: "This account uses Google Sign In"
            });
        }

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        user.password =
            newPassword;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};



//---------------------upload avatar----------------------
export const uploadAvatar = async(
    req,
    res
) => {

    const user = await User.findById(
        req.user.id
    )

    user.avatar =
        req.file.filename

    await user.save()

    res.json({
        success: true,
        avatar: user.avatar
    })
}



//-------------------2f factor authenticator----------------
export const setupTwoFactor = async(req, res) => {

    try {

        const user =
            await User.findById(req.user.id);

        const secret =
            speakeasy.generateSecret({
                name: `SmartMeet (${user.email})`
            });

        user.twoFactorSecret =
            secret.base32;

        await user.save();

        const qrCode =
            await QRCode.toDataURL(
                secret.otpauth_url
            );

        res.status(200).json({
            success: true,
            qrCode
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


export const verifyTwoFactor = async(req, res) => {

    try {

        const { token } = req.body;

        const user =
            await User.findById(req.user.id);

        if (!user.twoFactorSecret) {

            return res.status(400).json({
                success: false,
                message: "2FA setup not found"
            });

        }

        const verified =
            speakeasy.totp.verify({
                secret: user.twoFactorSecret,
                encoding: "base32",
                token,
                window: 1
            });

        if (!verified) {

            return res.status(400).json({
                success: false,
                message: "Invalid code"
            });

        }

        user.twoFactorEnabled = true;

        await user.save();

        res.status(200).json({
            success: true,
            message: "2FA enabled successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


export const disableTwoFactor = async(req, res) => {

    try {

        const user =
            await User.findById(req.user.id);

        user.twoFactorEnabled = false;

        user.twoFactorSecret = null;

        await user.save();

        res.status(200).json({
            success: true,
            message: "2FA disabled"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

//----------------sessions--------------------------
export const getUserSessions = async(req, res) => {

    try {

        console.log("REQ USER:");

        console.log(req.user);

        const sessions = await Session.find({
                user: req.user._id
            })
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            success: true,
            sessions
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};