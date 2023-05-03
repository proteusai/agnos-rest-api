import mongoose from "mongoose";
import { PermissionName } from "@constants/permissions";
import { BaseDocument } from "@models/base";
import TeamModel, { TeamDocument } from "../../../models/team.model";
import UserModel, { UserDocument } from "@models/user";
import OrgModel, { OrgDocument } from "@models/org";
import logger from "@/utils/logger";
import ProjectModel, { ProjectDocument } from "@models/project";
import ComponentModel, { ComponentDocument } from "@models/component";

export interface CollaborationInput {
  component?: ComponentDocument["_id"];
  org: OrgDocument["_id"];
  permission?: PermissionName;
  project?: ProjectDocument["_id"];
  team?: TeamDocument["_id"];
  user?: UserDocument["_id"];
}

export interface CollaborationDocument extends BaseDocument, CollaborationInput, mongoose.Document {}

const collaborationSchema = new mongoose.Schema(
  {
    component: { type: mongoose.Schema.Types.ObjectId, ref: "Component" },
    org: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
    permission: { type: String, enum: Object.keys(PermissionName), default: PermissionName.write },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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
  ComponentModel.updateMany({ collaborations: collaboration._id }, { $pull: { collaborations: collaboration._id } })
    .exec()
    .catch((reason) => {
      logger.error("Error removing collaborations for component", { reason, component: collaboration.component });
    });
  ProjectModel.updateMany({ collaborations: collaboration._id }, { $pull: { collaborations: collaboration._id } })
    .exec()
    .catch((reason) => {
      logger.error("Error removing collaborations for project", { reason, project: collaboration.project });
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
 *        component:
 *          oneOf:
 *            - $ref: '#/components/schemas/Component'
 *            - type: string
 *        org:
 *          oneOf:
 *            - $ref: '#/components/schemas/Organization'
 *            - type: string
 *        permission:
 *          type: string
 *          enum:
 *           - admin
 *           - read
 *           - write
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
