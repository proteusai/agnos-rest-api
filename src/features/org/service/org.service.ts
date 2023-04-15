import { omit } from "lodash";
import { FilterQuery } from "mongoose";
import { ServiceOptions } from "@services";
import OrgModel, { OrgDocument, OrgInput } from "@models/org";

export async function createOrg(input: OrgInput) {
  const team = await createOrgDocument(input);

  return omit(team.toJSON(), "secrets");
}
export async function createOrgDocument(input: OrgInput) {
  const team = await OrgModel.create(input);

  return team;
}

export async function findOrg(query: FilterQuery<OrgDocument>) {
  return OrgModel.findOne(query).lean();
}

export async function findOrgDocument(query: FilterQuery<OrgDocument>) {
  return OrgModel.findOne(query);
}

export async function findOrgs(query: FilterQuery<OrgDocument>, options: ServiceOptions) {
  return OrgModel.find(query).populate(options.populate).lean();
}
