import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      default: "portfolio"
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {}
    },
    version: {
      type: Number,
      default: 1
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin"
    }
  },
  {
    timestamps: true,
    minimize: false
  }
);

export const Content = mongoose.model("Content", contentSchema);
