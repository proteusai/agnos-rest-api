import { Request, Response } from "express";
import { PermissionName } from "../constants/permissions";
import { IGNORE_LEAST_CARDINALITY } from "../constants/settings";
import { CreateTeamInput, GetTeamInput, GetTeamsInput } from "../schema/team.schema";
import { createMembership } from "../service/membership.service";
import { createTeamDocument, findTeam, findTeams } from "../service/team.service";
import { findUserDocument } from "../service/user.service";
import { Obj } from "../types";

export async function createTeamHandler(req: Request<Obj, Obj, CreateTeamInput["body"]>, res: Response) {
  const user = res.locals.user;
  const userDoc = await findUserDocument({ _id: user._id });

  const team = await createTeamDocument({ ...req.body, user: user._id });
  const membership = await createMembership({
    user: user._id,
    team: team._id,
    role: PermissionName.ADMIN,
  });

  if (IGNORE_LEAST_CARDINALITY) {
    userDoc?.memberships?.push(membership);
    await userDoc?.save();
    team.memberships?.push(membership);
    await team.save();
  }

  return res.send({ team: team.toJSON() });
}

export async function getTeamHandler(req: Request<GetTeamInput["params"]>, res: Response) {
  const team = await findTeam({ _id: req.params.id });

  if (!team) {
    return res.sendStatus(404);
  }

  return res.send({ team });
}

export async function getTeamsHandler(req: Request<Obj, Obj, Obj, GetTeamsInput["query"]>, res: Response) {
  let populate: string[] | undefined = undefined;
  if (req.query.populate) {
    populate = req.query.populate.split(";");
  }

  const teams = await findTeams({}, { populate });
  return res.send({ teams });
}

export async function getMyTeamHandler(req: Request<Obj, Obj, Obj, GetTeamsInput["query"]>, res: Response) {
  let populate: string[] | undefined = undefined;
  if (req.query.populate) {
    populate = req.query.populate.split(";");
  }

  const user = res.locals.user;

  const team = await findTeam({ autoCreated: true, user: user._id });
  return res.send({ team });
}
