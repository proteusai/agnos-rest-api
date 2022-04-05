import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";

export interface UserInput {
  name: string;
  email: string;
  emailIsVerified?: boolean;
  password?: string;
  picture?: string;
}

export interface UserDocument extends UserInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<Boolean>;
}

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    emailIsVerified: { type: Boolean, required: false, default: false },
    password: { type: String, required: false },
    picture: { type: String, required: false },
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
