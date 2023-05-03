import { FilterQuery, FlattenMaps, LeanDocument, Types } from "mongoose";
import { ServiceOptions } from "@services";
import { DEFAULT_QUERY_LIMIT, DEFAULT_QUERY_SKIP } from "@/constants/defaults";
import ModelModel, { ModelDocument, ModelInput } from "@models/model";

export async function createModel(input: ModelInput) {
  const model = await createModelDocument(input);

  return model.toJSON() as FlattenMaps<
    LeanDocument<
      ModelDocument & {
        _id: Types.ObjectId;
      }
    >
  >;
}
export async function createModelDocument(input: ModelInput) {
  return ModelModel.create(input);
}

export async function findModel(query: FilterQuery<ModelDocument>, options?: ServiceOptions) {
  return ModelModel.findOne(query)
    .populate(options?.populate || [])
    .lean();
}

export async function findModelDocument(query: FilterQuery<ModelDocument>, options?: ServiceOptions) {
  return ModelModel.findOne(query).populate(options?.populate || []);
}

export async function findModels(query: FilterQuery<ModelDocument>, options?: ServiceOptions) {
  return ModelModel.find(query)
    .skip(options?.skip || DEFAULT_QUERY_SKIP)
    .limit(options?.limit || DEFAULT_QUERY_LIMIT)
    .sort(options?.sort || {})
    .populate(options?.populate || [])
    .lean();
}
