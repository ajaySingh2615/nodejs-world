// models/user.models.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    avatar: {
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: "https://placehold.co/200x200",
        localPath: "",
      },
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    // NOTE: stored as `fullname` right now. Keep as-is to avoid migrations.
    // Later you can rename to fullName and add a migration/alias.
    fullname: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      // (Optional hardening) select: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: String,
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    emailVerificationToken: String,
    emailVerificationTokenExpiry: Date,
  },
  { timestamps: true },
);

/* Helpful indexes for token lookups */
userSchema.index({
  emailVerificationToken: 1,
  emailVerificationTokenExpiry: 1,
});
userSchema.index({ forgotPasswordToken: 1, forgotPasswordTokenExpiry: 1 });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  // Defensive: if password not selected (future change), bail gracefully
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET not set");
  }
  return jwt.sign(
    { _id: this._id, email: this.email, username: this.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m" },
  );
};

userSchema.methods.generateRefreshToken = function () {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET not set");
  }
  // refresh payload can be minimal for safety
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
  });
};

userSchema.methods.generateTemporaryToken = function () {
  const unHashedToken = crypto.randomBytes(20).toString("hex"); // 40-char hex
  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");
  const tokenExpiry = new Date(Date.now() + 20 * 60 * 1000); // 20 minutes
  return { unHashedToken, hashedToken, tokenExpiry };
};

/* Never leak sensitive fields when serializing */
userSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.password;
    delete ret.refreshToken;
    delete ret.emailVerificationToken;
    delete ret.emailVerificationTokenExpiry;
    delete ret.forgotPasswordToken;
    delete ret.forgotPasswordTokenExpiry;
    delete ret.__v;
    return ret;
  },
});

export const User = mongoose.model("User", userSchema);
