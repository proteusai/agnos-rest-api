import { FilterQuery } from "mongoose";
import permissions from "../constants/permissions";
import MembershipModel, {
  MembershipDocument,
  MembershipInput,
} from "../models/membership.model";
import { findTeam } from "./team.service";
import { findUser } from "./user.service";

export async function createMembership(input: MembershipInput) {
  if (!input.permission) {
    input.permission = "READ";
  }
  const permissionValue = permissions[input.permission] || permissions.READ;
  const user = await findUser({ _id: input.userId });
  const team = await findTeam({ _id: input.teamId });
  const membership = await MembershipModel.create({
    ...input,
    permissionValue,
    userName: user?.name,
    userPicture: user?.picture,
    teamName: team?.name,
    teamPicture: team?.picture,
  });

  return membership.toJSON();
}

export async function findMemberships(query: FilterQuery<MembershipDocument>) {
  return MembershipModel.find(query).lean();
}

export async function findTeamMemberships(teamId: string) {
  return MembershipModel.find({ teamId }).lean();
}

export async function findUserMemberships(userId: string) {
  return MembershipModel.find({ userId }).lean();
}
