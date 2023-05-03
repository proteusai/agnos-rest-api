import { Node } from "@/types";
import { ModelDocument } from "@models/model";
import { FlattenMaps, LeanDocument, Types } from "mongoose";

export function convertModelToNode(
  model: FlattenMaps<
    LeanDocument<
      ModelDocument & {
        _id: Types.ObjectId;
      }
    >
  >
) {
  return {
    id: model._id,
    position: { x: 0, y: 0 },
    data: model.modelSchema,
    type: "model",
  } as Node;
}
