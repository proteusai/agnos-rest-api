import { FilterQuery, FlattenMaps, LeanDocument, Types } from "mongoose";
import { ServiceOptions } from "@services";
import { DEFAULT_QUERY_LIMIT, DEFAULT_QUERY_SKIP } from "@/constants/defaults";
import InstanceModel, { InstanceDocument, InstanceInput } from "@models/instance";

export async function createInstance(input: InstanceInput) {
  const instance = await createInstanceDocument(input);

  return instance.toJSON() as FlattenMaps<
    LeanDocument<
      InstanceDocument & {
        _id: Types.ObjectId;
      }
    >
  >;
}
export async function createInstanceDocument(input: InstanceInput) {
  return InstanceModel.create(input);
}

export async function findInstance(query: FilterQuery<InstanceDocument>, options?: ServiceOptions) {
  return InstanceModel.findOne(query)
    .populate(options?.populate || [])
    .lean();
}

export async function findInstanceDocument(query: FilterQuery<InstanceDocument>, options?: ServiceOptions) {
  return InstanceModel.findOne(query).populate(options?.populate || []);
}

export async function findInstances(query: FilterQuery<InstanceDocument>, options?: ServiceOptions) {
  return InstanceModel.find(query)
    .skip(options?.skip || DEFAULT_QUERY_SKIP)
    .limit(options?.limit || DEFAULT_QUERY_LIMIT)
    .sort(options?.sort || {})
    .populate(options?.populate || [])
    .lean();
}
