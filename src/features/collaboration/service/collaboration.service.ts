import CollaborationModel, { CollaborationDocument, CollaborationInput } from "@models/collaboration";
import { FilterQuery } from "mongoose";

const defaultPopulate = ["user", "team", "permission"];

export async function createCollaboration(input: CollaborationInput) {
  const collaboration = await CollaborationModel.create(input);

  return collaboration.toJSON();
}

export async function findCollaboration(query: FilterQuery<CollaborationDocument>) {
  return CollaborationModel.findOne(query).lean();
}
