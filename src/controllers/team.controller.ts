import { Request, Response } from "express";
import { IGNORE_LEAST_CARDINALITY } from "../constants/settings";
import { CreateTeamInput } from "../schema/team.schema";
import { createMembership } from "../service/membership.service";
import { createTeamDocument } from "../service/team.service";
import { findUserDocument } from "../service/user.service";

export async function createTeamHandler(
  req: Request<{}, {}, CreateTeamInput["body"]>,
  res: Response
) {
  const user = res.locals.user;
  const userDoc = await findUserDocument({ _id: user._id });

  const team = await createTeamDocument({ ...req.body, user: user._id });
  const membership = await createMembership({
    user: user._id,
    team: team._id,
    permission: "ADMIN",
  });

  if (IGNORE_LEAST_CARDINALITY) {
    userDoc?.memberships?.push(membership);
    await userDoc?.save();
    team.memberships?.push(membership);
    await team.save();
  }

  return res.send({ team: team.toJSON() });
}
