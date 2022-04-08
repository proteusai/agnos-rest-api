import { Request, Response } from "express";
import { DEFAULT_TEAM_NAME } from "../constants/defaults";
import { CreateUserInput } from "../schema/user.schema";
import { createMembership } from "../service/membership.service";
import { createTeam } from "../service/team.service";
import { createUser, findUser } from "../service/user.service";
import logger from "../utils/logger";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) {
  try {
    const user = await createUser(req.body);
    const team = await createTeam(user._id, {
      name: DEFAULT_TEAM_NAME,
      email: user.email,
    });
    await createMembership({
      userId: user._id,
      teamId: team._id,
      permission: "ADMIN",
    });
    return res.send({ user });
  } catch (error: any) {
    logger.error(error);
    return res.status(409).send({ error });
  }
}

export async function findMeHandler(req: Request, res: Response) {
  try {
    const _id = res.locals.user._id;
    const user = await findUser({ _id });
    return res.send({ user });
  } catch (error: any) {
    logger.error(error);
    return res.status(404).send({ error });
  }
}
