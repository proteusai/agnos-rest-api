import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";
import { BaseDocument } from "./base.model";
import MembershipModel from "./membership.model";
import { DEFAULT_USER_PICTURE } from "../constants/defaults";

export interface UserInput {
  name: string;
  email: string;
  emailIsVerified?: boolean;
  password?: string;
  picture?: string;
}

export interface UserDocument
  extends BaseDocument,
    UserInput,
    mongoose.Document {
  comparePassword(candidatePassword: string): Promise<Boolean>;
}

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    emailIsVerified: { type: Boolean, default: false },
    password: { type: String, required: false },
    picture: { type: String, required: false, default: DEFAULT_USER_PICTURE },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  let user = this as UserDocument;

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
userSchema.post("save", async function (doc, next) {
  let user = this as UserDocument;

  if (!user.isModified("name") && !user.isModified("picture")) {
    return next();
  }

  MembershipModel.updateMany(
    { userId: user._id },
    { userName: user.name, userPicture: user.picture }
  ).exec();

  return next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as UserDocument;

  if (!user.password) {
    return true;
  }

  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
