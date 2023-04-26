import { FilterQuery } from "mongoose";
import { ServiceOptions } from "@services";
import MembershipModel, { MembershipDocument, MembershipInput } from "@models/membership";

export async function createMembership(input: MembershipInput) {
  const membership = await MembershipModel.create(input);

  return membership.toJSON();
}

export async function findMembership(query: FilterQuery<MembershipDocument>) {
  return MembershipModel.findOne(query).lean();
}

export async function findMemberships(query: FilterQuery<MembershipDocument>, options: ServiceOptions) {
  return MembershipModel.find(query)
    .skip(options.skip)
    .limit(options.limit)
    .sort(options.sort)
    .populate(options.populate)
    .lean();
}
