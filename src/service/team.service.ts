import { omit } from "lodash";
import { FilterQuery } from "mongoose";
import { ServiceOptions } from ".";
import TeamModel, { TeamDocument, TeamInput } from "../models/team.model";

const defaultPopulate: string[] = [];

export async function createTeam(input: TeamInput) {
  const team = await createTeamDocument(input);

  return omit(team.toJSON(), "secrets");
}
export async function createTeamDocument(input: TeamInput) {
  try {
    const team = await TeamModel.create(input);

    return team;
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function findTeam(query: FilterQuery<TeamDocument>) {
  return TeamModel.findOne(query).lean();
}

export async function findTeamDocument(query: FilterQuery<TeamDocument>) {
  return TeamModel.findOne(query);
}

export async function findTeams(
  query: FilterQuery<TeamDocument>,
  options?: ServiceOptions
) {
  return TeamModel.find(query)
    .populate(options?.populate || defaultPopulate)
    .lean();
}
