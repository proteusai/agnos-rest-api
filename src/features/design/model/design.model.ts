import mongoose from "mongoose";
import { DEFAULT_DESIGN_PICTURE } from "@constants/defaults";
import { BaseDocument } from "@models/base";
import ProjectModel, { ProjectDocument } from "@models/project";
import CanvasModel, { CanvasDocument } from "@models/canvas";
import EnvModel, { EnvDocument } from "@models/env";
import InstanceModel, { InstanceDocument } from "@models/instance";
import logger from "@utils/logger";

export interface DesignInput {
  name: string;
  description?: string;
  picture?: string;
  project?: ProjectDocument["_id"];
}

export interface DesignDocument extends BaseDocument, DesignInput, mongoose.Document {
  canvas?: CanvasDocument["_id"];
  envs?: Array<EnvDocument["_id"]>;
  instances?: Array<InstanceDocument["_id"]>;
}

const designSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    canvas: { type: mongoose.Schema.Types.ObjectId, ref: "Canvas" },
    description: { type: String },
    envs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Environment" }],
    instances: [{ type: mongoose.Schema.Types.ObjectId, ref: "Instance" }],
    picture: { type: String, default: DEFAULT_DESIGN_PICTURE },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  },
  {
    timestamps: true,
  }
);

designSchema.pre("remove", function (next) {
  const design = this as unknown as DesignDocument;

  CanvasModel.remove({ design: design._id })
    .exec()
    .catch((reason: unknown) => {
      logger.error("Error removing canvases for design", { reason, design: design._id });
    });
  EnvModel.remove({ design: design._id })
    .exec()
    .catch((reason: unknown) => {
      logger.error("Error removing environments for design", { reason, design: design._id });
    });
  InstanceModel.remove({ design: design._id })
    .exec()
    .catch((reason: unknown) => {
      logger.error("Error removing instances for design", { reason, design: design._id });
    });
  ProjectModel.updateMany({ designs: design._id }, { $pull: { designs: design._id } })
    .exec()
    .catch((reason) => {
      logger.error("Error removing designs for project", { reason, project: design.project });
    });

  next();
});

/**
 * @openapi
 * components:
 *  schemas:
 *    Design:
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
 *        description:
 *          type: string
 *        envs:
 *          type: array
 *          items:
 *            oneOf:
 *              - $ref: '#/components/schemas/Environment'
 *              - type: string
 *        instances:
 *          type: array
 *          items:
 *            oneOf:
 *              - $ref: '#/components/schemas/Instance'
 *              - type: string
 *        picture:
 *          type: string
 *        project:
 *          oneOf:
 *            - $ref: '#/components/schemas/Project'
 *            - type: string
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 */

const DesignModel = mongoose.model<DesignDocument>("Design", designSchema);

export default DesignModel;
