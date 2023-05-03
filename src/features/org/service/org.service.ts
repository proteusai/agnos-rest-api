import { omit } from "lodash";
import { FilterQuery } from "mongoose";
import { ServiceOptions } from "@services";
import OrgModel, { OrgDocument, OrgInput } from "@models/org";
import { DEFAULT_QUERY_LIMIT, DEFAULT_QUERY_SKIP } from "@constants/defaults";

export async function createOrg(input: OrgInput) {
  const org = await createOrgDocument(input);

  return omit(org.toJSON(), "secrets");
}
export async function createOrgDocument(input: OrgInput) {
  return OrgModel.create(input);
}

export async function findOrg(query: FilterQuery<OrgDocument>, options?: ServiceOptions) {
  return OrgModel.findOne(query)
    .populate(options?.populate || [])
    .lean();
}

export async function findOrgDocument(query: FilterQuery<OrgDocument>, options?: ServiceOptions) {
  return OrgModel.findOne(query).populate(options?.populate || []);
}

export async function findOrgs(query: FilterQuery<OrgDocument>, options?: ServiceOptions) {
  return OrgModel.find(query)
    .skip(options?.skip || DEFAULT_QUERY_SKIP)
    .limit(options?.limit || DEFAULT_QUERY_LIMIT)
    .sort(options?.sort || {})
    .populate(options?.populate || [])
    .lean();
}
