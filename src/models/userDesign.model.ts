import mongoose from "mongoose";

const userDesignSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    designId: { type: String, required: true },
    permission: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);
