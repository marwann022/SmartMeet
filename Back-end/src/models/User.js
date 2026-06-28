import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Full Name is required."],
      trim: true,
      minlength: [3, "Name must be at least 3 characters."],
      validate: {
        validator: function (v) {
          return /^[a-zA-Z\s'\-]+$/.test(v);
        },
        message: "Name can only contain letters.",
      },
    },
    firstName: {
      type: String,
      required: [true, "Please Enter Your First Name"],
      trim: true,
      maxlength: [20, "First Name cannot exceed 20 characters"],
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [20, "Last Name cannot exceed 20 characters"],
    },
    email: {
      type: String,
      required: [true, "Email address is required."],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: "Please enter a valid email address.",
      },
    },
    password: {
      type: String,
      required: [
        function () {
          return !this.googleId;
        },
        "Password is required",
      ],
      minlength: [8, "Password should be greater than 8 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "active", "rejected"],
      default: "pending",
    },
    phone: {
      type: String,
      default: "",
    },

    company: {
      type: String,
      default: "",
    },

    jobTitle: {
      type: String,
      default: "",
    },

    avatar: {
      type: String,
      default: "",
    },

    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },

    twoFactorSecret: {
      type: String,
      default: null,
    },
    googleId: {
      type: String,
      default: null,
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
    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpire: {
      type: Date,
      default: null,
    },
    notificationSettings: {
      summaries: { type: Boolean, default: true },
      reports: { type: Boolean, default: true },
      digestTime: { type: String, default: "09:00 AM" },
      reminderWindow: { type: String, default: "10m" },
      quietHours: { type: Boolean, default: false },
      pushDesktop: { type: Boolean, default: true },
      pushMobile: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true, // gives time for created at and updated at
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.index({ createdAt: -1 });

userSchema.virtual("profileUrl").get(function () {
  return `/api/users/${this._id}`;
});

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema
  .virtual("twoFactor")
  .get(function () {
    return this.twoFactorEnabled;
  })
  .set(function (val) {
    this.twoFactorEnabled = val;
  });

// Hashing The password of the user before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

//used to compare the password entered by the user with the hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//used to get the user data without the password and refresh tokenwhen sending the response to the client
userSchema.methods.getPublicProfile = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.refreshToken;
  return userObject;
};

userSchema.statics.findActive = function () {
  return this.find({ isActive: true });
};

userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

const User = mongoose.model("User", userSchema);

export default User;
