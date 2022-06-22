import { Request, Response } from "express";
import { IGNORE_LEAST_CARDINALITY } from "../constants/settings";
import { TeamDocument } from "../models/team.model";
import { CreateFunctionInput, GetFunctionInput, GetFunctionsInput } from "../schema/function.schema";
import { createFunction, findFunction, findFunctions } from "../service/function.service";
import { findTeam, findTeamDocument } from "../service/team.service";

export async function createFunctionHandler(req: Request<{}, {}, CreateFunctionInput["body"]>, res: Response) {
  const user = res.locals.user;

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
    return res.status(404).send({ error: { message: "Could not find the team" } });
  }

  const func = await createFunction({
    ...req.body,
    user: user._id,
    team: team._id,
  });

  if (IGNORE_LEAST_CARDINALITY) {
    team.functions?.push(func);
    await team.save();
  }

  return res.send({ function: func });
}

export async function getFunctionHandler(req: Request<GetFunctionInput["params"]>, res: Response) {
  const func = await findFunction({ _id: req.params.id });

  if (!func) {
    return res.sendStatus(404);
  }

  return res.send({ function: func });
}

export async function getFunctionsHandler(req: Request<{}, {}, {}, GetFunctionsInput["query"]>, res: Response) {
  let populate: string[] | undefined = undefined;
  if (req.query.populate) {
    populate = req.query.populate.split(";");
  }

  let team = null;
  if (req.query.team) {
    team = await findTeam({ _id: req.query.team });
  }
  if (req.query.team && !team) {
    return res.status(404).send({ error: { message: "Could not find the team" } });
  }

  // TODO: if user is not a member of this team return only public functions

  const functions = await findFunctions(
    {
      ...(team && { team: team._id }),
    },
    {
      populate,
    }
  );
  return res.send({ functions });
}

export async function getMyFunctionsHandler(req: Request<{}, {}, {}, GetFunctionsInput["query"]>, res: Response) {
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

  const functions = await findFunctions(
    { team: team._id },
    {
      populate,
    }
  );
  return res.send({ functions });
}
