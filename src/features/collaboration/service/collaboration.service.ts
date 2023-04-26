import { ServiceOptions } from "@services";
import CollaborationModel, { CollaborationDocument, CollaborationInput } from "@models/collaboration";
import { FilterQuery } from "mongoose";

export async function createCollaboration(input: CollaborationInput) {
  const collaboration = await CollaborationModel.create(input);

  return collaboration.toJSON();
}

export async function findCollaboration(query: FilterQuery<CollaborationDocument>) {
  return CollaborationModel.findOne(query).lean();
}

export async function findCollaborations(query: FilterQuery<CollaborationDocument>, options: ServiceOptions) {
  return CollaborationModel.find(query)
    .skip(options.skip)
    .limit(options.limit)
    .sort(options.sort)
    .populate(options.populate)
    .lean();
}
