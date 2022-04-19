import { Request, Response } from "express";
import { nanoid } from "nanoid";
import slugify from "slugify";
import { IGNORE_LEAST_CARDINALITY } from "../constants/settings";
import {
  CreateFunctionVersionInput,
  GetFunctionVersionInput,
  GetFunctionVersionsInput,
} from "../schema/functionVersion.schema";
import {
  findFunction,
  findFunctionDocument,
} from "../service/function.service";
import {
  createFunctionVersion,
  findFunctionVersion,
  findFunctionVersions,
} from "../service/functionVersion.service";

export async function createFunctionVersionHandler(
  req: Request<{}, {}, CreateFunctionVersionInput["body"]>,
  res: Response
) {
  const user = res.locals.user;

  const func = await findFunctionDocument({ _id: req.body.function });
  if (!func) {
    return res
      .status(404)
      .send({ error: { message: "Could not find the function" } });
  }

  // TODO: check that user has permission in the func.team

  const _id = slugify(
    `${func.name} ${req.body.name} ${Date.now()} ${nanoid()}`,
    { lower: true, strict: true }
  );
  console.log(">>>>>>>>>>>>>>>>>>>>>", _id)
  const functionVersion = await createFunctionVersion({
    _id,
    ...req.body,
    user: user._id,
    team: func.team,
  });

  if (IGNORE_LEAST_CARDINALITY) {
    func.versions?.push(functionVersion);
    await func.save();
  }

  return res.send({ functionVersion });
}

export async function getFunctionVersionHandler(
  req: Request<GetFunctionVersionInput["params"]>,
  res: Response
) {
  const functionVersion = await findFunctionVersion({ _id: req.params.id });

  if (!functionVersion) {
    return res.sendStatus(404);
  }

  return res.send({ functionVersion });
}

export async function getFunctionVersionsHandler(
  req: Request<{}, {}, {}, GetFunctionVersionsInput["query"]>,
  res: Response
) {
  let populate: string[] | undefined = undefined;
  if (req.query.populate) {
    populate = req.query.populate.split(";");
  }

  let func = null;
  if (req.query.function) {
    func = await findFunction({ _id: req.query.function });
  }
  if (req.query.function && !func) {
    return res
      .status(404)
      .send({ error: { message: "Could not find the function" } });
  }

  // TODO: if user is not a member of func.team return only published function versions

  const functionVersions = await findFunctionVersions(
    { ...(func && { function: func._id }) },
    { populate }
  );
  return res.send({ functionVersions });
}
