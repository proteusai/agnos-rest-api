import mongoose from "mongoose";
import { BaseDocument } from "@models/base";
import { UserDocument } from "@models/user";

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

/**
 * @openapi
 * components:
 *  schemas:
 *    Session:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        user:
 *          oneOf:
 *            - $ref: '#/components/schemas/User'
 *            - type: string
 *        email:
 *          type: string
 *        accessToken:
 *          type: string
 *        valid:
 *          type: boolean
 *        userAgent:
 *          type: string
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 */

const SessionModel = mongoose.model<SessionDocument>("Session", sessionSchema);

export default SessionModel;
