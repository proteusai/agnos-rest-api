import { Request, Response } from "express";
import {
  CreateTeamDesignShareInput,
  GetTeamDesignSharesInput,
} from "../schema/teamDesignShare.schema";
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

export async function findTeamDesignSharesForTeamHandler(
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
  const teamDesignShares = await findTeamDesignSharesForTeam(req.params.team, {
    populate,
  });
  return res.send({ teamDesignShares });
}
