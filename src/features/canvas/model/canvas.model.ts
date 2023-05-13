import mongoose from "mongoose";
import { BaseDocument } from "@models/base";
import { ProjectDocument } from "@models/project";
import { DesignDocument } from "@models/design";

export interface CanvasInput {
  design?: DesignDocument["_id"];
  nodes?: Array<object>;
  project?: ProjectDocument["_id"];
}

export interface CanvasDocument extends BaseDocument, CanvasInput, mongoose.Document {}

const canvasSchema = new mongoose.Schema(
  {
    design: { type: mongoose.Schema.Types.ObjectId, ref: "Design" },
    nodes: [{}], // TODO: use NodeSchema here
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  },
  {
    timestamps: true,
  }
);

/**
 * @openapi
 * components:
 *  schemas:
 *    Canvas:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        design:
 *          oneOf:
 *            - $ref: '#/components/schemas/Design'
 *            - type: string
 *        nodes:
 *          type: array
 *          items:
 *            oneOf:
 *              - $ref: '#/components/schemas/Node'
 *              - type: string
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

const CanvasModel = mongoose.model<CanvasDocument>("Canvas", canvasSchema);

export default CanvasModel;
