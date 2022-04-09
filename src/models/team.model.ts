import mongoose from "mongoose";
import { DEFAULT_TEAM_PICTURE } from "../constants/defaults";
import { BaseDocument } from "./base.model";
import MembershipModel, { MembershipDocument } from "./membership.model";
import { UserDocument } from "./user.model";

export interface TeamInput {
  name: string;
  description?: string;
  email?: string;
  private?: boolean;
  picture?: string;
  secrets?: object;
}

export interface TeamDocument
  extends BaseDocument,
    TeamInput,
    mongoose.Document {
  memberships?: Array<MembershipDocument["_id"]>;
  user: UserDocument["_id"]; // ref to the user that created this team
}

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    email: { type: String },
    memberships: [{ type: mongoose.Schema.Types.ObjectId, ref: "Membership" }],
    private: { type: Boolean, default: false },
    picture: { type: String, default: DEFAULT_TEAM_PICTURE },
    secrets: { type: {} },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

teamSchema.pre("remove", async function (next) {
  let team = this as TeamDocument;

  MembershipModel.remove({ teamId: team._id }).exec();

  return next();
});

const TeamModel = mongoose.model<TeamDocument>("Team", teamSchema);

export default TeamModel;
