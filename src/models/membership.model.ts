import mongoose from "mongoose";
import { DEFAULT_TEAM_PICTURE, DEFAULT_USER_PICTURE } from "../constants/defaults";
import permissions, { PermissionName } from "../constants/permissions";
import { BaseDocument } from "./base.model";
import { TeamDocument } from "./team.model";
import { UserDocument } from "./user.model";

export interface MembershipInput {
  userId: UserDocument["_id"];
  teamId: TeamDocument["_id"];
  permission?: PermissionName;
}

export interface MembershipDocument extends BaseDocument, MembershipInput, mongoose.Document {
  permission: PermissionName;
  permissionValue: number;
  userName?: string;
  userPicture?: string;
  teamName?: string;
  teamPicture?: string;
}

const membershipSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    permission: { type: String, default: "READ" },
    permissionValue: { type: Number, default: permissions.READ },
    userName: { type: String, required: false },
    userPicture: { type: String, required: false, default: DEFAULT_USER_PICTURE },
    teamName: { type: String, required: false },
    teamPicture: { type: String, required: false, default: DEFAULT_TEAM_PICTURE },
  },
  {
    timestamps: true,
  }
);

const MembershipModel = mongoose.model<MembershipDocument>("Membership", membershipSchema);

export default MembershipModel;
