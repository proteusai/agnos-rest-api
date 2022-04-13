import { Request, Response } from "express";
import { TeamDocument } from "../models/team.model";
import {
  CreateTeamDesignShareInput,
  GetTeamDesignSharesInput,
} from "../schema/teamDesignShare.schema";
import { findTeam } from "../service/team.service";
import {
  createTeamDesignShare,
  findTeamDesignSharesForTeam,
} from "../service/teamDesignShare.service";

export async function createTeamDesignShareHandler(
  req: Request<{}, {}, CreateTeamDesignShareInput["body"]>,
  res: Response
) {
  const teamDesignShare = await createTeamDesignShare(req.body);
  return res.send({ teamDesignShare });
}

export async function getTeamDesignSharesForTeamHandler(
  req: Request<
    GetTeamDesignSharesInput["params"],
    {},
    {},
    GetTeamDesignSharesInput["query"]
  >,
  res: Response
) {
  let populate: string[] | undefined = undefined;
  if (req.query.populate) {
    populate = req.query.populate.split(";");
  }

  const user = res.locals.user;

  let team = null;
  if (req.params.team) {
    team = await findTeam({ _id: req.params.team });
  } else {
    team = await findTeam({ autoCreated: true, user: user._id });
  }
  if (!team) {
    return res
      .status(404)
      .send({ error: { message: "Could not find the team" } });
  }

  const teamDesignShares = await findTeamDesignSharesForTeam(team._id, {
    populate,
  });
  return res.send({ teamDesignShares });
}
