import { Request, Response } from "express";
import { DEFAULT_TEAM_NAME } from "../constants/defaults";
import { CreateUserInput } from "../schema/user.schema";
import { createMembership } from "../service/membership.service";
import { createSettings } from "../service/settings.service";
import { createTeamDocument } from "../service/team.service";
import { createUserDocument, findUser } from "../service/user.service";
import logger from "../utils/logger";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) {
  try {
    const user = await createUserDocument(req.body);
    const team = await createTeamDocument({
      name: DEFAULT_TEAM_NAME,
      email: user.email,
      autoCreated: true,
      description: "This is your own space and you can invite people in.",
      private: true,
      user: user._id,
    });
    const membership = await createMembership({
      user: user._id,
      team: team._id,
      permission: "ADMIN",
    });

    const settings = await createSettings({ user: user._id });

    user.memberships?.push(membership);
    user.settings = settings._id;
    await user.save();
    team.memberships?.push(membership);
    await team.save();

    return res.send({ user: user.toJSON() });
  } catch (error: any) {
    logger.error(error);
    return res.status(409).send({ error });
  }
}

export async function getMeHandler(req: Request, res: Response) {
  try {
    const _id = res.locals.user._id;
    const user = await findUser({ _id });
    return res.send({ user });
  } catch (error: any) {
    logger.error(error);
    return res.status(404).send({ error });
  }
}
