import { FilterQuery } from "mongoose";
import { ServiceOptions } from ".";
import MembershipModel, {
  MembershipDocument,
  MembershipInput,
} from "../models/membership.model";

const defaultPopulate = ["user", "team", "permission"];

export async function createMembership(input: MembershipInput) {
  if (!input.permission) {
    input.permission = "READ";
  }
  const membership = await MembershipModel.create(input);

  return membership.toJSON();
}

export async function findMemberships(
  query: FilterQuery<MembershipDocument>,
  options?: ServiceOptions
) {
  return MembershipModel.find(query)
    .populate(options?.populate || defaultPopulate)
    .lean();
}
