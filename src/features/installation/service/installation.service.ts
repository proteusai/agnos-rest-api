import { FilterQuery, FlattenMaps, LeanDocument, Types } from "mongoose";
import { ServiceOptions } from "@services";
import InstallationModel, { InstallationDocument, InstallationInput } from "@models/installation";
import { DEFAULT_QUERY_LIMIT, DEFAULT_QUERY_SKIP } from "@constants/defaults";

export async function createInstallation(input: InstallationInput) {
  const installation = await createInstallationDocument(input);

  return installation.toJSON() as FlattenMaps<
    LeanDocument<
      InstallationDocument & {
        _id: Types.ObjectId;
      }
    >
  >;
}
export async function createInstallationDocument(input: InstallationInput) {
  return InstallationModel.create(input);
}

export async function findInstallation(query: FilterQuery<InstallationDocument>, options?: ServiceOptions) {
  return InstallationModel.findOne(query)
    .populate(options?.populate || [])
    .lean();
}

export async function findInstallationDocument(query: FilterQuery<InstallationDocument>, options?: ServiceOptions) {
  return InstallationModel.findOne(query).populate(options?.populate || []);
}

export async function findInstallations(query: FilterQuery<InstallationDocument>, options?: ServiceOptions) {
  return InstallationModel.find(query)
    .skip(options?.skip || DEFAULT_QUERY_SKIP)
    .limit(options?.limit || DEFAULT_QUERY_LIMIT)
    .sort(options?.sort || {})
    .populate(options?.populate || [])
    .lean();
}
