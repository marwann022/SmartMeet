import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

import sendEmail from "../utils/sendEmail.js";

import crypto from "crypto";

// ---------------- Register ----------------
export const register = async(req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Validation
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields",
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({
            email: email.toLowerCase(),
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }

        // Create user
        const user = await User.create({
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
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password",
            });
        }

        // Find user
        const user = await User.findOne({
            email: email.toLowerCase(),
        }).select("+password");



        // User not found
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password",
            });
        }

        // Compare passwords
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password",
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate JWT
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: "Login Successful",
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

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};




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