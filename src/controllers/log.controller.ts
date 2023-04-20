import { Request, Response } from "express";
import { GetLogsInput } from "../schema/log.schema";
import { findLogs } from "../service/log.service";
import { Obj } from "../types";

export async function getLogsHandler(req: Request<Obj, Obj, Obj, GetLogsInput["query"]>, res: Response) {
  let populate: string[] | undefined = undefined;
  if (req.query.populate) {
    populate = req.query.populate.split(";");
  }

  const logs = await findLogs({ ...(req.query.source && { source: req.query.source }) });
  return res.send({ logs });
}
