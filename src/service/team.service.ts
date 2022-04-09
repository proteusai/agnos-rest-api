import { omit } from "lodash";
import { FilterQuery } from "mongoose";
import TeamModel, { TeamDocument, TeamInput } from "../models/team.model";

export async function createTeam(userId: string, input: TeamInput) {
  const team = await createTeamAndReturnModel(userId, input);

  return omit(team.toJSON(), "secrets");
}
export async function createTeamAndReturnModel(
  userId: string,
  input: TeamInput
) {
  try {
    const team = await TeamModel.create({ ...input, user: userId });

    return team;
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function findTeam(query: FilterQuery<TeamDocument>) {
  return TeamModel.findOne(query).lean();
}
