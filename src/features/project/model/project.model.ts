import mongoose from "mongoose";
import { DEFAULT_PROJECT_PICTURE } from "@constants/defaults";
import { BaseDocument } from "@models/base";
import { UserDocument } from "@models/user";
import logger from "@utils/logger";
import OrgModel, { OrgDocument } from "@models/org";
import CollaborationModel, { CollaborationDocument } from "@models/collaboration";
import CanvasModel, { CanvasDocument } from "@models/canvas";
import ModelModel, { ModelDocument } from "@models/model";

export interface ProjectInput {
  name: string;
  description?: string;
  personal?: boolean;
  private?: boolean;
  picture?: string;
  secrets?: object;
  org: OrgDocument["_id"];
  user: UserDocument["_id"];
}

export interface ProjectDocument extends BaseDocument, ProjectInput, mongoose.Document {
  canvas?: CanvasDocument["_id"];
  collaborations?: Array<CollaborationDocument["_id"]>;
  models?: Array<ModelDocument["_id"]>;
}

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    canvas: { type: mongoose.Schema.Types.ObjectId, ref: "Canvas" },
    collaborations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collaboration" }],
    description: { type: String },
    models: [{ type: mongoose.Schema.Types.ObjectId, ref: "Model" }],
    personal: { type: Boolean, default: false },
    private: { type: Boolean, default: false },
    picture: { type: String, default: DEFAULT_PROJECT_PICTURE },
    secrets: { type: {} },
    org: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

projectSchema.pre("remove", async function (next) {
  const project = this as unknown as ProjectDocument;

  CanvasModel.remove({ project: project._id })
    .exec()
    .catch((reason: unknown) => {
      logger.error("Error removing canvases for project", { reason, project: project._id });
    });
  CollaborationModel.remove({ project: project._id })
    .exec()
    .catch((reason: unknown) => {
      logger.error("Error removing collaborations for project", { reason, project: project._id });
    });
  ModelModel.remove({ project: project._id })
    .exec()
    .catch((reason: unknown) => {
      logger.error("Error removing models for project", { reason, project: project._id });
    });
  OrgModel.updateMany({ projects: project._id }, { $pull: { projects: project._id } })
    .exec()
    .catch((reason) => {
      logger.error("Error removing projects for org", { reason, org: project.org });
    });

  return next();
});

/**
 * @openapi
 * components:
 *  schemas:
 *    Project:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        name:
 *          type: string
 *        canvas:
 *          oneOf:
 *            - $ref: '#/components/schemas/Canvas'
 *            - type: string
 *        collaborations:
 *          type: array
 *          items:
 *            oneOf:
 *              - $ref: '#/components/schemas/Collaboration'
 *              - type: string
 *        description:
 *          type: string
 *        models:
 *          type: array
 *          items:
 *            oneOf:
 *              - $ref: '#/components/schemas/Model'
 *              - type: string
 *        org:
 *          oneOf:
 *            - $ref: '#/components/schemas/Organization'
 *            - type: string
 *        personal:
 *          type: boolean
 *        picture:
 *          type: string
 *        private:
 *          type: boolean
 *        secrets:
 *          type: object
 *          additionalProperties: true
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

const ProjectModel = mongoose.model<ProjectDocument>("Project", projectSchema);

export default ProjectModel;
