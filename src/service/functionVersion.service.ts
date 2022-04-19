import { FilterQuery } from "mongoose";
import { ServiceOptions } from ".";
import FunctionVersionModel, {
  FunctionVersionDocument,
  FunctionVersionInput,
} from "../models/functionVersion.model";

const defaultPopulate = ["function", "team", "user"];

export async function createFunctionVersion(input: FunctionVersionInput) {
  const functionVersion = await createFunctionVersionDocument(input);

  return functionVersion.toJSON();
}
export async function createFunctionVersionDocument(
  input: FunctionVersionInput
) {
  const functionVersion = await FunctionVersionModel.create(input);

  return functionVersion;
}

export async function findFunctionVersion(
  query: FilterQuery<FunctionVersionDocument>
) {
  return FunctionVersionModel.findOne(query).lean();
}

export async function findFunctionVersions(
  query: FilterQuery<FunctionVersionDocument>,
  options?: ServiceOptions
) {
  return FunctionVersionModel.find(query)
    .populate(options?.populate || defaultPopulate)
    .sort({ createdAt: -1 })
    .lean();
}
