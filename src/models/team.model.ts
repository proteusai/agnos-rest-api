import mongoose from "mongoose";
import { DEFAULT_TEAM_PICTURE } from "../constants/defaults";
import { BaseDocument } from "./base.model";
import MembershipModel from "./membership.model";
import { UserDocument } from "./user.model";

export interface TeamInput {
  name: string;
  email?: string;
  private?: boolean;
  picture?: string;
  secrets?: object;
}

export interface TeamDocument
  extends BaseDocument,
    TeamInput,
    mongoose.Document {
  userId: UserDocument["_id"]; // the ID of the user that created this team
}

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: false, unique: true },
    private: { type: Boolean, default: false },
    picture: { type: String, required: false, default: DEFAULT_TEAM_PICTURE },
    secrets: { type: {}, required: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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
teamSchema.post("save", async function (doc, next) {
  let team = this as TeamDocument;

  if (!team.isModified("name") && !team.isModified("picture")) {
    return next();
  }

  MembershipModel.updateMany(
    { teamId: team._id },
    { teamName: team.name, teamPicture: team.picture }
  ).exec();

  return next();
});

const TeamModel = mongoose.model<TeamDocument>("Team", teamSchema);

export default TeamModel;
