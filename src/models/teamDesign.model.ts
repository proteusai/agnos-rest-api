import mongoose from "mongoose";

const teamDesignSchema = new mongoose.Schema(
  {
    teamId: { type: String, required: true },
    designId: { type: String, required: true },
    permission: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);
