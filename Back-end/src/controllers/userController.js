import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

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