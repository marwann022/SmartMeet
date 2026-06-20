import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please Enter Your First Name"],
        trim: true,
        maxlength: [20, "First Name cannot exceed 20 characters"],
    },
    lastName: {
        type: String,
        required: [true, "Please Enter Your Last Name"],
        trim: true,
        maxlength: [20, "Last Name cannot exceed 20 characters"],
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        lowercase: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please enter a valid email"
        ]
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minlength: [8, "Password should be greater than 8 characters"],
        select: false,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    //used for if the user deleted it's account i still have it's data in the database but it will not be active
    isActive: {
        type: Boolean,
        default: true,
    },
    lastLogin: {
        type: Date,
        default: null,
    },
    refreshToken: {
        type: String,
        default: null,
    },
}, {
    timestamps: true, // gives time for created at and updated at
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

userSchema.index({ createdAt: -1 })


userSchema.virtual("profileUrl").get(function() {
    return `/api/users/${this._id}`;
});

userSchema.virtual("fullName").get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Hashing The password of the user before saving
userSchema.pre("save", async function() {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

//used to compare the password entered by the user with the hashed password in the database
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

//used to get the user data without the password and refresh tokenwhen sending the response to the client
userSchema.methods.getPublicProfile = function() {
    const userObject = this.toObject()
    delete userObject.password;
    delete userObject.refreshToken;
    return userObject;
}

userSchema.statics.findActive = function() {
    return this.find({ isActive: true });
}

userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email: email.toLowerCase() });
}

const User = mongoose.model("User", userSchema);

export default User;