import mongoose from "mongoose";
import { DEFAULT_TEAM_PICTURE } from "../constants/defaults";
import { BaseDocument } from "./base.model";
import DesignModel, { DesignDocument } from "./design.model";
import FunctionModel, { FunctionDocument } from "./function.model";
import MembershipModel, { MembershipDocument } from "./membership.model";
import PluginModel, { PluginDocument } from "./plugin.model";
import TeamDesignShareModel, { TeamDesignShareDocument } from "./teamDesignShare.model";
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

export interface TeamDocument extends BaseDocument, TeamInput, mongoose.Document {
  designs?: Array<DesignDocument["_id"]>;
  functions?: Array<FunctionDocument["_id"]>;
  memberships?: Array<MembershipDocument["_id"]>;
  plugins?: Array<PluginDocument["_id"]>;
  teamDesignShares?: Array<TeamDesignShareDocument["_id"]>;
}

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    autoCreated: { type: Boolean, default: false },
    description: { type: String },
    designs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Design" }],
    email: { type: String },
    functions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Function" }],
    memberships: [{ type: mongoose.Schema.Types.ObjectId, ref: "Membership" }],
    private: { type: Boolean, default: false },
    picture: { type: String, default: DEFAULT_TEAM_PICTURE },
    plugins: [{ type: mongoose.Schema.Types.ObjectId, ref: "Plugin" }],
    secrets: { type: {} },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
    teamDesignShares: [{ type: mongoose.Schema.Types.ObjectId, ref: "TeamDesignShare" }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

teamSchema.pre("remove", async function (next) {
  const team = this as TeamDocument;

  DesignModel.remove({ team: team._id })
    .exec()
    .catch(() => {
      // TODO: what do we do?
    });
  FunctionModel.remove({ team: team._id })
    .exec()
    .catch(() => {
      // TODO: what do we do?
    });
  MembershipModel.remove({ team: team._id })
    .exec()
    .catch(() => {
      // TODO: what do we do?
    });
  PluginModel.remove({ team: team._id })
    .exec()
    .catch(() => {
      // TODO: what do we do?
    });
  TeamDesignShareModel.remove({ team: team._id })
    .exec()
    .catch(() => {
      // TODO: what do we do?
    });

  return next();
});

const TeamModel = mongoose.model<TeamDocument>("Team", teamSchema);

export default TeamModel;
