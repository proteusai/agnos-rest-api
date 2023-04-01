import { Request, Response } from "express";
import { DEFAULT_TEAM_NAME } from "../constants/defaults";
import { PermissionName } from "../constants/permissions";
import { IGNORE_LEAST_CARDINALITY } from "../constants/settings";
import { CreateUserInput } from "../schema/user.schema";
import { createMembership } from "../service/membership.service";
import { createSettings } from "../service/settings.service";
import { createTeamDocument } from "../service/team.service";
import { createUserDocument, findUser } from "../service/user.service";
import { Obj } from "../types";
import logger from "../utils/logger";

export async function createUserHandler(req: Request<Obj, Obj, CreateUserInput["body"]>, res: Response) {
  try {
    const user = await createUserDocument(req.body);
    // create org and org membership
    /*
     * when a user tries to perform ACTION on RESOURCE which requires a PERMISSION
     * 1. Get TEAMS the user belong to in this ORG: teams { user, org }
     * 2. Get all PERMISSIONS on the RESOURCE >= the required PERMISSION
     * 3. For each PERMISSION:
     * 4.  If the PERMISSION is on a user, check if the user is the same as the user performing the ACTION
     * 5.  If the PERMISSION is on a team, check if the user belongs to the team (if the TEAM is in the list of TEAMS from step 1)
     *
     * Org Membership: user, org, permission
     * Team Membership: user, team, org, permission
     *
     * Project Permission: project, permission, user|team
     */
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
      permission: PermissionName.ADMIN,
    });

    const settings = await createSettings({ user: user._id });

    if (IGNORE_LEAST_CARDINALITY) {
      team.memberships?.push(membership);
      await team.save();
      user.memberships?.push(membership);
    }
    user.settings = settings._id;
    await user.save();

    return res.send({ user: user.toJSON() });
  } catch (error: unknown) {
    logger.error(error);
    return res.status(409).send({ error });
  }
}

export async function getMeHandler(req: Request, res: Response) {
  try {
    const _id = res.locals.user._id;
    const user = await findUser({ _id });
    return res.send({ user });
  } catch (error: unknown) {
    logger.error(error);
    return res.status(404).send({ error });
  }
}
