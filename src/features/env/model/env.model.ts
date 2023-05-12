import mongoose from "mongoose";
import { BaseDocument } from "@models/base";
import DesignModel, { DesignDocument } from "@models/design";
import { Data, DataSchema } from "@models/data";
import logger from "@utils/logger";

export interface EnvInput {
  name: string;
  description?: string;
  design: DesignDocument["_id"];
  location: string; // local|aws|gcp|azure
  os: string; // linux|windows|mac
  version: string; // 1.0.0
}

export interface EnvDocument extends BaseDocument, EnvInput, mongoose.Document {
  data?: { [name: string]: Data };
}

const envSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    data: { type: Map, of: DataSchema },
    description: { type: String },
    design: { type: mongoose.Schema.Types.ObjectId, ref: "Design", required: true },
    location: { type: String, required: true },
    os: { type: String, required: true },
    version: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

envSchema.pre("remove", function (next) {
  const env = this as unknown as EnvDocument;

  DesignModel.updateMany({ envs: env._id }, { $pull: { envs: env._id } })
    .exec()
    .catch((reason) => {
      logger.error("Error removing environments for design", { reason, design: env.design });
    });

  next();
});

/**
 * @openapi
 * components:
 *  schemas:
 *    Environment:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        name:
 *          type: string
 *        data:
 *          type: object
 *          additionalProperties:
 *              $ref: '#/components/schemas/Data'
 *        description:
 *          type: string
 *        design:
 *          oneOf:
 *            - $ref: '#/components/schemas/Design'
 *            - type: string
 *        location:
 *          type: string
 *        os:
 *          type: string
 *        version:
 *          type: string
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 */

const EnvModel = mongoose.model<EnvDocument>("Environment", envSchema);

export default EnvModel;
