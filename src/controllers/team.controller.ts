import { Request, Response } from "express";
import { CreateTeamInput } from "../schema/team.schema";
import { createTeam } from "../service/team.service";

export async function createTeamHandler(
  req: Request<{}, {}, CreateTeamInput["body"]>,
  res: Response
) {
  const user = res.locals.user;
  const team = await createTeam(user._id, req.body);
  return res.send({ team });
}
