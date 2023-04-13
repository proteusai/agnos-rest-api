import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";
import { BaseDocument } from "@models/base";
import { DEFAULT_USER_PICTURE } from "@constants/defaults";
import { MembershipDocument } from "@models/membership";
import { SettingsDocument } from "@models/settings";
import { CollaborationDocument } from "@models/collaboration";

export interface UserInput {
  name: string;
  email: string;
  emailIsVerified?: boolean;
  password?: string;
  picture?: string;
}

export interface UserDocument extends BaseDocument, UserInput, mongoose.Document {
  collaborations?: Array<CollaborationDocument["_id"]>;
  memberships?: Array<MembershipDocument["_id"]>;
  settings?: SettingsDocument["_id"];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    collaborations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collaboration" }],
    email: { type: String, match: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, required: true, unique: true },
    emailIsVerified: { type: Boolean, default: false },
    memberships: [{ type: mongoose.Schema.Types.ObjectId, ref: "Membership" }],
    password: { type: String },
    picture: { type: String, default: DEFAULT_USER_PICTURE },
    settings: { type: mongoose.Schema.Types.ObjectId, ref: "Settings" },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this as UserDocument;

  if (!user.password) {
    return next();
  }

  if (!user.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));

  const hash = await bcrypt.hash(user.password, salt);

  user.password = hash;

  return next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  const user = this as UserDocument;

  if (!user.password || !candidatePassword) {
    return false;
  }

  return bcrypt.compare(candidatePassword, user.password).catch(() => false);
};

/**
 * @openapi
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        name:
 *          type: string
 *        collaborations:
 *          type: array
 *          items:
 *            oneOf:
 *              - $ref: '#/components/schemas/Collaboration'
 *              - type: string
 *        email:
 *          type: string
 *        emailIsVerified:
 *          type: boolean
 *        memberships:
 *          type: array
 *          items:
 *            oneOf:
 *              - $ref: '#/components/schemas/Membership'
 *              - type: string
 *        picture:
 *          type: string
 *        settings:
 *          oneOf:
 *            - $ref: '#/components/schemas/Settings'
 *            - type: string
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 */

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
