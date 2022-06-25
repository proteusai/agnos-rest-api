import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";
import { BaseDocument } from "./base.model";
import { DEFAULT_USER_PICTURE } from "../constants/defaults";
import { MembershipDocument } from "./membership.model";
import { UserDesignShareDocument } from "./userDesignShare.model";
import { SettingsDocument } from "./settings.model";

export interface UserInput {
  name: string;
  email: string;
  emailIsVerified?: boolean;
  password?: string;
  picture?: string;
}

export interface UserDocument extends BaseDocument, UserInput, mongoose.Document {
  memberships?: Array<MembershipDocument["_id"]>;
  settings?: SettingsDocument["_id"];
  userDesignShares?: Array<UserDesignShareDocument["_id"]>;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    emailIsVerified: { type: Boolean, default: false },
    memberships: [{ type: mongoose.Schema.Types.ObjectId, ref: "Membership" }],
    password: { type: String },
    picture: { type: String, default: DEFAULT_USER_PICTURE },
    settings: { type: mongoose.Schema.Types.ObjectId, ref: "Settings" },
    userDesignShares: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserDesignShare" }],
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

  if (!user.password) {
    return true;
  }

  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
