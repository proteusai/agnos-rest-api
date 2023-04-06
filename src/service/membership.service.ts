import { FilterQuery } from "mongoose";
import { ServiceOptions } from ".";
import MembershipModel, { MembershipDocument, MembershipInput } from "@models/membership";

const defaultPopulate = ["user", "team", "permission"];

export async function createMembership(input: MembershipInput) {
  const membership = await MembershipModel.create(input);

  return membership.toJSON();
}

export async function findMemberships(query: FilterQuery<MembershipDocument>, options?: ServiceOptions) {
  return MembershipModel.find(query)
    .populate(options?.populate || defaultPopulate)
    .lean();
}
