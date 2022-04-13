import { Request, Response } from "express";
import { TeamDocument } from "../models/team.model";
import { CreateDesignInput, GetDesignInput } from "../schema/design.schema";
import { createDesignDocument, findDesign } from "../service/design.service";
import { findTeamDocument } from "../service/team.service";
import { createTeamDesignShare } from "../service/teamDesignShare.service";
import { findUserDocument } from "../service/user.service";
import { createUserDesignShare } from "../service/userDesignShare.service";

export async function createDesignHandler(
  req: Request<{}, {}, CreateDesignInput["body"]>,
  res: Response
) {
  const user = res.locals.user;
  const userDoc = await findUserDocument({ _id: user._id });

  let team:
    | (TeamDocument & {
        _id: any;
      })
    | null = null;
  if (req.body.team) {
    team = await findTeamDocument({ _id: req.body.team });
  } else {
    team = await findTeamDocument({ autoCreated: true, user: user._id });
  }
  if (!team) {
    return res
      .status(404)
      .send({ error: { message: "Could not find the team" } });
  }

  const design = await createDesignDocument({
    ...req.body,
    user: user._id,
    team: team._id,
  });

  const userDesignShare = await createUserDesignShare({
    user: user._id,
    design: design._id,
    permission: "ADMIN",
  });
  userDoc?.userDesignShares?.push(userDesignShare);
  await userDoc?.save();

  const teamDesignShare = await createTeamDesignShare({
    team: team._id,
    design: design._id,
    permission: "ADMIN",
  });
  team.teamDesignShares?.push(teamDesignShare);
  await team.save();

  return res.send({ design: design.toJSON() });
}

export async function getDesignHandler(
  req: Request<GetDesignInput["params"]>,
  res: Response
) {
  const design = await findDesign({ _id: req.params.id });

  if (!design) {
    return res.sendStatus(404);
  }

  return res.send({ design });
}
