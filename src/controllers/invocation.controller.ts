import { Request, Response } from "express";
import { GetInvocationsInput } from "../schema/invocation.schema";
import { findInvocations } from "../service/invocation.service";

export async function getInvocationsHandler(
  req: Request<{}, {}, {}, GetInvocationsInput["query"]>,
  res: Response
) {
  let populate: string[] | undefined = undefined;
  if (req.query.populate) {
    populate = req.query.populate.split(";");
  }

  const invocations = await findInvocations(
    {
      ...(req.query.function && { function: req.query.function }),
      ...(req.query.version && { version: req.query.version }),
    },
    { populate }
  );

  return res.send({ invocations });
}
