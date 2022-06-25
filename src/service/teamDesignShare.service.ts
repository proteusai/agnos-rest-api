import { FilterQuery } from "mongoose";
import { ServiceOptions } from ".";
import TeamDesignShareModel, { TeamDesignShareDocument, TeamDesignShareInput } from "../models/teamDesignShare.model";

const defaultPopulate = ["design", "team", "permission"];

export async function createTeamDesignShare(input: TeamDesignShareInput) {
  const teamDesignShare = await TeamDesignShareModel.create(input);

  return teamDesignShare.toJSON();
}

export async function findTeamDesignShares(query: FilterQuery<TeamDesignShareDocument>, options?: ServiceOptions) {
  return TeamDesignShareModel.find(query)
    .populate(options?.populate || defaultPopulate)
    .lean();
}
