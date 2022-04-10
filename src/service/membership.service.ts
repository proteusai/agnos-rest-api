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

export async function findMemberships(query: FilterQuery<MembershipDocument>) {
  return MembershipModel.find(query).lean();
}

export async function findMembershipsForTeam(
  teamId: string,
  options?: ServiceOptions
) {
  return MembershipModel.find({ team: teamId })
    .populate(options?.populate || defaultPopulate)
    .lean();
}

export async function findMembershipsForUser(
  userId: string,
  options?: ServiceOptions
) {
  return MembershipModel.find({ user: userId })
    .populate(options?.populate || defaultPopulate)
    .lean();
}
