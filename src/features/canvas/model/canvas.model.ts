import mongoose from "mongoose";
import { BaseDocument } from "@models/base";
import { ProjectDocument } from "@models/project";

export interface CanvasInput {
  // design: DesignDocument["_id"];
  nodes?: Array<object>;
  project?: ProjectDocument["_id"];
}

export interface CanvasDocument extends BaseDocument, CanvasInput, mongoose.Document {}

const canvasSchema = new mongoose.Schema(
  {
    design: { type: mongoose.Schema.Types.ObjectId, ref: "Design" },
    nodes: [{}],
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  },
  {
    timestamps: true,
  }
);

const CanvasModel = mongoose.model<CanvasDocument>("Canvas", canvasSchema);

export default CanvasModel;
