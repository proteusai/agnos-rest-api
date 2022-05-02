import { Request, Response } from "express";
import { LogType } from "../constants/log";
import { GetLogsInput } from "../schema/log.schema";
import { findLogs } from "../service/log.service";

export async function getLogsHandler(
  req: Request<{}, {}, {}, GetLogsInput["query"]>,
  res: Response
) {
  let populate: string[] | undefined = undefined;
  if (req.query.populate) {
    populate = req.query.populate.split(";");
  }

  const logs = await findLogs(
    { ...(req.query.source && { source: req.query.source }) },
    { populate }
  );
  return res.send({ logs });
}
