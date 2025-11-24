import mongoose from "mongoose";

const usageSnapshotSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    day: {
      type: Date,
      required: true,
    },
    requests: {
      type: Number,
      default: 0,
    },
    tokens: {
      type: Number,
      default: 0,
    },
    metadata: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

usageSnapshotSchema.index({ userId: 1, day: 1 }, { unique: true });

export const UsageSnapshot = mongoose.model("UsageSnapshot", usageSnapshotSchema);
