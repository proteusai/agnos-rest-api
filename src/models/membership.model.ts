import mongoose from "mongoose";
import { PermissionName } from "../constants/permissions";
import { BaseDocument } from "./base.model";
import { TeamDocument } from "./team.model";
import { UserDocument } from "./user.model";

export interface MembershipInput {
  user: UserDocument["_id"];
  team: TeamDocument["_id"];
  permission: PermissionName;
}

export interface MembershipDocument
  extends BaseDocument,
    MembershipInput,
    mongoose.Document {}

const membershipSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    permission: { type: String, ref: "Permission" },
  },
  {
    timestamps: true,
  }
);

const MembershipModel = mongoose.model<MembershipDocument>(
  "Membership",
  membershipSchema
);

export default MembershipModel;
