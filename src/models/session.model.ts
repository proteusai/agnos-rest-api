import mongoose from "mongoose";
import { BaseDocument } from "./base.model";
import { UserDocument } from "./user.model";

export interface SessionInput {
  userId: UserDocument["_id"];
  email: string;
  accessToken: string;
  valid?: boolean;
  userAgent?: string;
}

export interface SessionDocument
  extends BaseDocument,
    SessionInput,
    mongoose.Document {}

const sessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    email: { type: String, required: true },
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
