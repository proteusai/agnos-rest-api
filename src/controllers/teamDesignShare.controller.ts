import { Request, Response } from "express";
import { PermissionName } from "../constants/permissions";
import { CreateTeamDesignShareInput, GetTeamDesignSharesInput } from "../schema/teamDesignShare.schema";
import { findTeam } from "../service/team.service";
import { createTeamDesignShare, findTeamDesignShares } from "../service/teamDesignShare.service";
import { Obj } from "../types";

export async function createTeamDesignShareHandler(
  req: Request<Obj, Obj, CreateTeamDesignShareInput["body"]>,
  res: Response
) {
  const teamDesignShare = await createTeamDesignShare({
    ...req.body,
    permission: PermissionName[req.body.permission],
  });
  return res.send({ teamDesignShare });
}

export async function getMyTeamDesignSharesHandler(
  req: Request<Obj, Obj, Obj, GetTeamDesignSharesInput["query"]>,
  res: Response
) {
  let populate: string[] | undefined = undefined;
  if (req.query.populate) {
    populate = req.query.populate.split(";");
  }

  const user = res.locals.user;

  let team = null;
  if (req.query.team) {
    team = await findTeam({ _id: req.query.team });
    // TODO: check that user is a member of this team
  } else {
    team = await findTeam({ autoCreated: true, user: user._id });
  }
  if (!team) {
    return res.status(404).send({ error: { message: "Could not find the team" } });
  }

  const teamDesignShares = await findTeamDesignShares(
    { team: team._id },
    {
      populate,
    }
  );
  return res.send({ teamDesignShares });
}
