import { FilterQuery, FlattenMaps, LeanDocument, Types } from "mongoose";
import { ServiceOptions } from "@services";
import ComponentModel, { ComponentDocument, ComponentInput } from "@models/component";
import { DEFAULT_QUERY_LIMIT, DEFAULT_QUERY_SKIP } from "@constants/defaults";

export async function createComponent(input: ComponentInput) {
  const component = await createComponentDocument(input);

  return component.toJSON() as FlattenMaps<
    LeanDocument<
      ComponentDocument & {
        _id: Types.ObjectId;
      }
    >
  >;
}
export async function createComponentDocument(input: ComponentInput) {
  return ComponentModel.create(input);
}

export async function findComponent(query: FilterQuery<ComponentDocument>, options?: ServiceOptions) {
  return ComponentModel.findOne(query)
    .populate(options?.populate || [])
    .lean();
}

export async function findComponentDocument(query: FilterQuery<ComponentDocument>, options?: ServiceOptions) {
  return ComponentModel.findOne(query).populate(options?.populate || []);
}

export async function findComponents(query: FilterQuery<ComponentDocument>, options?: ServiceOptions) {
  return ComponentModel.find(query)
    .skip(options?.skip || DEFAULT_QUERY_SKIP)
    .limit(options?.limit || DEFAULT_QUERY_LIMIT)
    .sort(options?.sort || {})
    .populate(options?.populate || [])
    .lean();
}
