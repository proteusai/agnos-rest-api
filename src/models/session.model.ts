import mongoose from "mongoose";
import { BaseDocument } from "./base.model";
import { UserDocument } from "./user.model";

export interface SessionDocument extends BaseDocument, mongoose.Document {
  userId: UserDocument["_id"];
  valid: boolean;
  userAgent: string;
}

const sessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    valid: { type: Boolean, default: true },
    userAgent: { type: String },
  },
  {
    timestamps: true,
  }
);

const SessionModel = mongoose.model<SessionDocument>("Session", sessionSchema);

export default SessionModel;
