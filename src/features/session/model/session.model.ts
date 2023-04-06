import mongoose from "mongoose";
import { BaseDocument } from "@models/base.model";
import { UserDocument } from "@models/user.model";

export interface SessionInput {
  user: UserDocument["_id"];
  email: string;
  accessToken: string;
  valid?: boolean;
  userAgent?: string;
}

export interface SessionDocument extends BaseDocument, SessionInput, mongoose.Document {}

const sessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    email: { type: String, required: true, match: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/ },
    accessToken: { type: String, required: true },
    valid: { type: Boolean, default: true },
    userAgent: { type: String },
  },
  {
    timestamps: true,
  }
);

const SessionModel = mongoose.model<SessionDocument>("Session", sessionSchema);

export default SessionModel;
