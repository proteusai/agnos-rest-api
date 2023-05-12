import { FilterQuery, FlattenMaps, LeanDocument, Types } from "mongoose";
import { ServiceOptions } from "@services";
import { DEFAULT_QUERY_LIMIT, DEFAULT_QUERY_SKIP } from "@/constants/defaults";
import DesignModel, { DesignDocument, DesignInput } from "@models/design";

export async function createDesign(input: DesignInput) {
  const design = await createDesignDocument(input);

  return design.toJSON() as FlattenMaps<
    LeanDocument<
      DesignDocument & {
        _id: Types.ObjectId;
      }
    >
  >;
}
export async function createDesignDocument(input: DesignInput) {
  return DesignModel.create(input);
}

export async function findDesign(query: FilterQuery<DesignDocument>, options?: ServiceOptions) {
  return DesignModel.findOne(query)
    .populate(options?.populate || [])
    .lean();
}

export async function findDesignDocument(query: FilterQuery<DesignDocument>, options?: ServiceOptions) {
  return DesignModel.findOne(query).populate(options?.populate || []);
}

export async function findDesigns(query: FilterQuery<DesignDocument>, options?: ServiceOptions) {
  return DesignModel.find(query)
    .skip(options?.skip || DEFAULT_QUERY_SKIP)
    .limit(options?.limit || DEFAULT_QUERY_LIMIT)
    .sort(options?.sort || {})
    .populate(options?.populate || [])
    .lean();
}
