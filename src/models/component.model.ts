import mongoose from "mongoose";

const componentSchema = new mongoose.Schema(
  {
    providers: [
      {
        title: { type: String, required: true },
        handler: { type: String, required: true },
        headers: {},
        data: {},
      },
    ],
  },
  {
    timestamps: true,
  }
);
