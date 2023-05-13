import mongoose from "mongoose";
import { DEFAULT_TEAM_PICTURE } from "@constants/defaults";
import { BaseDocument } from "@models/base";
import FunctionModel, { FunctionDocument } from "./function.model";
import MembershipModel, { MembershipDocument } from "@models/membership";
import { UserDocument } from "@models/user";
import CollaborationModel, { CollaborationDocument } from "@models/collaboration";

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
  collaborations?: Array<CollaborationDocument["_id"]>;
  functions?: Array<FunctionDocument["_id"]>;
  memberships?: Array<MembershipDocument["_id"]>;
}

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    collaborations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collaboration" }],
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
  const team = this as unknown as TeamDocument;

  CollaborationModel.remove({ team: team._id })
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

  return next();
});

/**
 * @openapi
 * components:
 *  schemas:
 *    Team:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 */
const TeamModel = mongoose.model<TeamDocument>("Team", teamSchema);

export default TeamModel;
