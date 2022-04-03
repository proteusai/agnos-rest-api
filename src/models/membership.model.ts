import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    teamId: { type: String, required: true },
    permission: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);
