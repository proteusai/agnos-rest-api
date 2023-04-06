import mongoose from "mongoose";
import { RoleName } from "@constants/permissions";
import { BaseDocument } from "@models/base.model";
import TeamModel, { TeamDocument } from "../../../models/team.model";
import UserModel, { UserDocument } from "@models/user.model";
import OrgModel, { OrgDocument } from "@models/org.model";
import logger from "@/utils/logger";

export interface MembershipInput {
  user: UserDocument["_id"];
  org: OrgDocument["_id"];
  team?: TeamDocument["_id"];
  role?: RoleName;
}

export interface MembershipDocument extends BaseDocument, MembershipInput, mongoose.Document {}

const membershipSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    org: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    role: { type: String, enum: Object.keys(RoleName), default: RoleName.MEMBER },
  },
  {
    timestamps: true,
  }
);

membershipSchema.pre("remove", function (next) {
  const membership = this as unknown as MembershipDocument;

  OrgModel.updateMany({ memberships: membership._id }, { $pull: { memberships: membership._id } })
    .exec()
    .catch((reason) => {
      logger.error("Error removing memberships for org", { reason, org: membership.org });
    });
  TeamModel.updateMany({ memberships: membership._id }, { $pull: { memberships: membership._id } })
    .exec()
    .catch((reason) => {
      logger.error("Error removing memberships for team", { reason, team: membership.team });
    });
  UserModel.updateMany({ memberships: membership._id }, { $pull: { memberships: membership._id } })
    .exec()
    .catch((reason) => {
      logger.error("Error removing memberships for user", { reason, user: membership.user });
    });

  next();
});

const MembershipModel = mongoose.model<MembershipDocument>("Membership", membershipSchema);

export default MembershipModel;
