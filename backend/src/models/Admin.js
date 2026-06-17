import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "Portfolio Admin"
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["owner", "editor"],
      default: "owner"
    },
    lastLoginAt: Date
  },
  { timestamps: true }
);

export const Admin = mongoose.model("Admin", adminSchema);
