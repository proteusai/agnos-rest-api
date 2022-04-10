import mongoose from "mongoose";
import { DEFAULT_TEAM_PICTURE } from "../constants/defaults";
import { BaseDocument } from "./base.model";
import DesignModel, { DesignDocument } from "./design.model";
import MembershipModel, { MembershipDocument } from "./membership.model";
import ServiceModel, { ServiceDocument } from "./service.model";
import TeamDesignShareModel, {
  TeamDesignShareDocument,
} from "./teamDesignShare.model";
import { UserDocument } from "./user.model";

export interface TeamInput {
  name: string;
  autoCreated?: boolean; // true if this team was created automatically for the user by Agnos; that user can never be removed from this team
  description?: string;
  email?: string;
  private?: boolean;
  picture?: string;
  secrets?: object;
  user: UserDocument["_id"]; // ref to the user that created this team
}

export interface TeamDocument
  extends BaseDocument,
    TeamInput,
    mongoose.Document {
  designs?: Array<DesignDocument["_id"]>;
  memberships?: Array<MembershipDocument["_id"]>;
  services?: Array<ServiceDocument["_id"]>;
  teamDesignShares?: Array<TeamDesignShareDocument["_id"]>;
}

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    autoCreated: { type: Boolean, default: false },
    description: { type: String },
    designs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Design" }],
    email: { type: String },
    memberships: [{ type: mongoose.Schema.Types.ObjectId, ref: "Membership" }],
    private: { type: Boolean, default: false },
    picture: { type: String, default: DEFAULT_TEAM_PICTURE },
    secrets: { type: {} },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
    teamDesignShares: [
      { type: mongoose.Schema.Types.ObjectId, ref: "TeamDesignShare" },
    ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

teamSchema.pre("remove", async function (next) {
  let team = this as TeamDocument;

  DesignModel.remove({ team: team._id }).exec();
  MembershipModel.remove({ team: team._id }).exec();
  ServiceModel.remove({ team: team._id }).exec();
  TeamDesignShareModel.remove({ team: team._id }).exec();

  return next();
});

const TeamModel = mongoose.model<TeamDocument>("Team", teamSchema);

export default TeamModel;
