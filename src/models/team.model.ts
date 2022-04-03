import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    secrets: {},
  },
  {
    timestamps: true,
  }
);
