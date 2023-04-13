import mongoose from "mongoose";
import { PermissionName } from "@constants/permissions";
import { BaseDocument } from "@models/base";
import TeamModel, { TeamDocument } from "../../../models/team.model";
import UserModel, { UserDocument } from "@models/user";
import OrgModel, { OrgDocument } from "@models/org";
import logger from "@/utils/logger";
import ProjectModel, { ProjectDocument } from "@models/project";

export interface CollaborationInput {
  user?: UserDocument["_id"];
  org: OrgDocument["_id"];
  project: ProjectDocument["_id"];
  team?: TeamDocument["_id"];
  permission?: PermissionName;
}

export interface CollaborationDocument extends BaseDocument, CollaborationInput, mongoose.Document {}

const collaborationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    org: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    permission: { type: String, enum: Object.keys(PermissionName), default: PermissionName.WRITE },
  },
  {
    timestamps: true,
  }
);

collaborationSchema.pre("remove", function (next) {
  const collaboration = this as unknown as CollaborationDocument;

  OrgModel.updateMany({ collaborations: collaboration._id }, { $pull: { collaborations: collaboration._id } })
    .exec()
    .catch((reason) => {
      logger.error("Error removing collaborations for org", { reason, org: collaboration.org });
    });
  ProjectModel.updateMany({ collaborations: collaboration._id }, { $pull: { collaborations: collaboration._id } })
    .exec()
    .catch((reason) => {
      logger.error("Error removing collaborations for project", { reason, org: collaboration.org });
    });
  TeamModel.updateMany({ collaborations: collaboration._id }, { $pull: { collaborations: collaboration._id } })
    .exec()
    .catch((reason) => {
      logger.error("Error removing collaborations for team", { reason, team: collaboration.team });
    });
  UserModel.updateMany({ collaborations: collaboration._id }, { $pull: { collaborations: collaboration._id } })
    .exec()
    .catch((reason) => {
      logger.error("Error removing collaborations for user", { reason, user: collaboration.user });
    });

  next();
});

/**
 * @openapi
 * components:
 *  schemas:
 *    Collaboration:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        org:
 *          oneOf:
 *            - $ref: '#/components/schemas/Organization'
 *            - type: string
 *        permission:
 *          type: string
 *          enum:
 *           - ADMIN
 *           - READ
 *           - WRITE
 *        project:
 *          oneOf:
 *            - $ref: '#/components/schemas/Project'
 *            - type: string
 *        team:
 *          oneOf:
 *            - $ref: '#/components/schemas/Team'
 *            - type: string
 *        user:
 *          oneOf:
 *            - $ref: '#/components/schemas/User'
 *            - type: string
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 */

const CollaborationModel = mongoose.model<CollaborationDocument>("Collaboration", collaborationSchema);

export default CollaborationModel;
