import CollaborationModel, { CollaborationDocument, CollaborationInput } from "@models/collaboration";

const defaultPopulate = ["user", "team", "permission"];

export async function createCollaboration(input: CollaborationInput) {
  const collaboration = await CollaborationModel.create(input);

  return collaboration.toJSON();
}
