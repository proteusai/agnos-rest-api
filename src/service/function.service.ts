import { FilterQuery } from "mongoose";
import { ServiceOptions } from ".";
import FunctionModel, {
  FunctionDocument,
  FunctionInput,
} from "../models/function.model";

const defaultPopulate = ["versions"];

export async function createFunction(input: FunctionInput) {
  const func = await createFunctionDocument(input);

  return func.toJSON();
}
export async function createFunctionDocument(input: FunctionInput) {
  const func = await FunctionModel.create(input);

  return func;
}

export async function findFunction(query: FilterQuery<FunctionDocument>) {
  return FunctionModel.findOne(query).lean();
}

export async function findFunctions(
  query: FilterQuery<FunctionDocument>,
  options?: ServiceOptions
) {
  return FunctionModel.find(query)
    .populate(options?.populate || defaultPopulate)
    .lean();
}
