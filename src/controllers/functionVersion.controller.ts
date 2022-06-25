import { Request, Response } from "express";
import { get } from "lodash";
import { nanoid } from "nanoid";
import slugify from "slugify";
import { PermissionScope } from "../constants/permissions";
import { IGNORE_LEAST_CARDINALITY } from "../constants/settings";
import {
  CreateFunctionVersionInput,
  GetFunctionVersionInput,
  GetFunctionVersionsInput,
  RunFunctionVersionInput,
  UpdateFunctionVersionInput,
} from "../schema/functionVersion.schema";
import { findFunction, findFunctionDocument } from "../service/function.service";
import {
  createFunctionVersion,
  findAndUpdateFunctionVersion,
  findFunctionVersion,
  findFunctionVersions,
  runFunctionVersion,
} from "../service/functionVersion.service";
import { Obj } from "../types";

export async function createFunctionVersionHandler(
  req: Request<Obj, Obj, CreateFunctionVersionInput["body"]>,
  res: Response
) {
  const user = res.locals.user;

  const func = await findFunctionDocument({ _id: req.body.function });
  if (!func) {
    return res.status(404).send({ error: { message: "Could not find the function" } });
  }

  // TODO: check that user has permission in the func.team

  const _id = slugify(`${func.name} ${req.body.name} ${Date.now()} ${nanoid()}`, { lower: true, strict: true });

  const functionVersion = await createFunctionVersion({
    _id,
    ...req.body,
    scopes: req.body.scopes?.map((scope) => PermissionScope[scope]),
    user: user._id,
    team: func.team,
  });

  if (IGNORE_LEAST_CARDINALITY) {
    func.versions?.push(functionVersion);
    await func.save();
  }

  return res.send({ functionVersion });
}

export async function getFunctionVersionHandler(req: Request<GetFunctionVersionInput["params"]>, res: Response) {
  const functionVersion = await findFunctionVersion({ _id: req.params.id });

  if (!functionVersion) {
    return res.sendStatus(404);
  }

  return res.send({ functionVersion });
}

export async function getFunctionVersionsHandler(
  req: Request<Obj, Obj, Obj, GetFunctionVersionsInput["query"]>,
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
    return res.status(404).send({ error: { message: "Could not find the function" } });
  }

  // TODO: if user is not a member of func.team return only published function versions

  const functionVersions = await findFunctionVersions({ ...(func && { function: func._id }) }, { populate });
  return res.send({ functionVersions });
}

export async function updateFunctionVersionHandler(
  req: Request<UpdateFunctionVersionInput["params"], Obj, UpdateFunctionVersionInput["body"]>,
  res: Response
) {
  const _id = req.params.id;
  const update = req.body;

  const funcVer = await findFunctionVersion({ _id });

  if (!funcVer) {
    return res.sendStatus(404);
  }
  if (funcVer.published) {
    return res.status(403).send({
      error: { message: "Published function versions cannot be updated" },
    });
  }

  // TODO: ensure that the user has permission to update this func ver

  const functionVersion = await findAndUpdateFunctionVersion({ _id }, update, {
    new: true,
  });

  return res.send({ functionVersion });
}

export async function runFunctionVersionHandler(
  req: Request<
    RunFunctionVersionInput["params"],
    Obj,
    RunFunctionVersionInput["body"],
    RunFunctionVersionInput["query"]
  >,
  res: Response
) {
  const accessToken = get(req, "headers.authorization", "").replace(/^Bearer\s/, "");
  try {
    const result = await runFunctionVersion(
      {
        _id: req.params.id,
      },
      {
        args: {
          form: req.body.form,
          user: {
            _id: res.locals.user._id,
            accessToken,
          },
        },
        test: req.query.test ? req.query.test.toLowerCase() === "true" : false,
      }
    );

    return res.send({ result });
  } catch (error) {
    return res.send({ error: { message: String(error) } });
  }
}
