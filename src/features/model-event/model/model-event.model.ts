import { ModelDocument } from "@models/model";
import mongoose from "mongoose";

export type ModelEventType =
  | "model_created"
  | "model_updated"
  | "model_deleted"
  | "model_field_created"
  | "model_field_updated"
  | "model_field_deleted";

const modelEventTypes = [
  "model_created",
  "model_updated",
  "model_deleted",
  "model_field_created",
  "model_field_updated",
  "model_field_deleted",
];

export interface ModelEvent {
  type: ModelEventType;
  model?: ModelDocument["_id"];
  before?: object;
  after?: object;
}

/**
 * @openapi
 * components:
 *  schemas:
 *    ModelEvent:
 *      type: object
 *      properties:
 *        type:
 *          type: string
 *          enum:
 *            - model_created
 *            - model_updated
 *            - model_deleted
 *            - model_field_created
 *            - model_field_updated
 *            - model_field_deleted
 *        model:
 *          type: string
 *        before:
 *          type: object
 *          additionalProperties: true
 *        after:
 *          type: object
 *          additionalProperties: true
 */
export const ModelEventSchema = {
  type: { type: String, enum: modelEventTypes, required: true },
  model: { type: mongoose.Schema.Types.ObjectId, ref: "Model", required: true },
  before: { type: {} },
  after: { type: {} },
};
