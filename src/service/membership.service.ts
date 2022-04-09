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
  // let permission = await findPermission({ name: input.permission });
  // if (!permission) {
  //   permission = await findPermission({ name: "READ" });
  // }
  const membership = await MembershipModel.create(input);

  // const m = new MembershipModel({
  //   user: input.user,
  //   team: input.team,
  //   permission,
  // });

  // const m2 = await m.save()
  // return m.toJSON()

  return membership.toJSON();
}

export async function findMemberships(query: FilterQuery<MembershipDocument>) {
  return MembershipModel.find(query).lean();
}

export async function findTeamMemberships(
  teamId: string,
  options?: ServiceOptions
) {
  return MembershipModel.find({ teamId })
    .populate(options?.populate || defaultPopulate)
    .lean();
}

export async function findUserMemberships(
  userId: string,
  options?: ServiceOptions
) {
  return MembershipModel.find({ userId })
    .populate(options?.populate || defaultPopulate)
    .lean();
}
