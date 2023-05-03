import mongoose from "mongoose";
import { BaseDocument } from "@models/base";
import { UserDocument } from "@models/user";
import logger from "@utils/logger";
import ProjectModel, { ProjectDocument } from "@models/project";

export interface ModelInput {
  name: string;
  description?: string;
  modelSchema: object;
  project: ProjectDocument["_id"];
  user: UserDocument["_id"];
}

export interface ModelDocument extends BaseDocument, ModelInput, mongoose.Document {}

const modelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    modelSchema: { type: {}, required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

modelSchema.pre("remove", async function (next) {
  const model = this as unknown as ModelDocument;

  ProjectModel.updateMany({ models: model._id }, { $pull: { models: model._id } })
    .exec()
    .catch((reason) => {
      logger.error("Error removing models for project", { reason, project: model.project });
    });

  return next();
});

/**
 * @openapi
 * components:
 *  schemas:
 *    Model:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        name:
 *          type: string
 *        description:
 *          type: string
 *        schema:
 *          type: object
 *          additionalProperties: true
 *        project:
 *          oneOf:
 *            - $ref: '#/components/schemas/Project'
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

const ModelModel = mongoose.model<ModelDocument>("Model", modelSchema);

export default ModelModel;
