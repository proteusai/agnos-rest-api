import { Request, Response } from "express";
import { DEFAULT_TEAM_NAME } from "../constants/defaults";
import { CreateUserInput } from "../schema/user.schema";
import { createMembership } from "../service/membership.service";
import { createTeamAndReturnModel } from "../service/team.service";
import { createUserAndReturnModel, findUser } from "../service/user.service";
import logger from "../utils/logger";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) {
  try {
    const user = await createUserAndReturnModel(req.body);
    const team = await createTeamAndReturnModel(user._id, {
      name: DEFAULT_TEAM_NAME,
      email: user.email,
      description: "This is your own space and you can invite people in.",
      private: true,
    });
    const membership = await createMembership({
      user: user._id,
      team: team._id,
      permission: "ADMIN",
    });

    user.memberships?.push(membership);
    await user.save();
    team.memberships?.push(membership);
    await team.save();

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
