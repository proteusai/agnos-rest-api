import mongoose from "mongoose";
import { BaseDocument } from "@models/base";
import ComponentModel, { ComponentDocument } from "@models/component";
import DesignModel, { DesignDocument } from "@models/design";
import InstallationModel, { InstallationDocument } from "@models/installation";
import { ModelDocument } from "@models/model";
import { Data, DataSchema } from "@models/data";
import logger from "@utils/logger";

export interface InstanceInput {
  name: string;
  component?: ComponentDocument["_id"]; // for testing the component
  description?: string;
  design: DesignDocument["_id"];
  installation?: InstallationDocument["_id"];
}

export interface InstanceDocument extends BaseDocument, InstanceInput, mongoose.Document {
  data?: Data;
  models?: Array<ModelDocument["_id"]>; // array of models to listen to
}

const instanceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    component: { type: mongoose.Schema.Types.ObjectId, ref: "Component" },
    data: DataSchema,
    description: { type: String },
    design: { type: mongoose.Schema.Types.ObjectId, ref: "Design", required: true },
    installation: { type: mongoose.Schema.Types.ObjectId, ref: "Installation" },
    models: [{ type: mongoose.Schema.Types.ObjectId, ref: "Model" }],
  },
  {
    timestamps: true,
  }
);

instanceSchema.pre("remove", function (next) {
  const instance = this as unknown as InstanceDocument;

  ComponentModel.updateMany({ instances: instance._id }, { $pull: { instances: instance._id } })
    .exec()
    .catch((reason) => {
      logger.error("Error removing instances for component", { reason, component: instance.component });
    });

  DesignModel.updateMany({ instances: instance._id }, { $pull: { instances: instance._id } })
    .exec()
    .catch((reason) => {
      logger.error("Error removing instances for design", { reason, design: instance.design });
    });

  InstallationModel.updateMany({ instances: instance._id }, { $pull: { instances: instance._id } })
    .exec()
    .catch((reason) => {
      logger.error("Error removing instances for installation", { reason, installation: instance.installation });
    });

  next();
});

/**
 * @openapi
 * components:
 *  schemas:
 *    Instance:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        name:
 *          type: string
 *        component:
 *          oneOf:
 *            - $ref: '#/components/schemas/Component'
 *            - type: string
 *        data:
 *          $ref: '#/components/schemas/Data'
 *        description:
 *          type: string
 *        design:
 *          oneOf:
 *            - $ref: '#/components/schemas/Design'
 *            - type: string
 *        installation:
 *          oneOf:
 *            - $ref: '#/components/schemas/Installation'
 *            - type: string
 *        models:
 *          type: array
 *          items:
 *            oneOf:
 *              - $ref: '#/components/schemas/Model'
 *              - type: string
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 */

const InstanceModel = mongoose.model<InstanceDocument>("Instance", instanceSchema);

export default InstanceModel;
