import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 200,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    phone: {
      type: String,
      trim: true,
      default: "",
      maxlength: 80
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000
    },
    status: {
      type: String,
      enum: ["new", "read", "archived"],
      default: "new"
    },
    source: {
      type: String,
      default: "portfolio"
    }
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
