import { FilterQuery } from "mongoose";
import { ServiceOptions } from ".";
import LogModel, { LogDocument, LogInput } from "../models/log.model";

const defaultPopulate: string[] = [];

export async function createLog(input: LogInput) {
  const log = await createLogDocument(input);

  return log.toJSON();
}
export async function createLogDocument(input: LogInput) {
  const log = await LogModel.create(input);

  return log;
}

export async function findLog(query: FilterQuery<LogDocument>) {
  return LogModel.findOne(query).lean();
}

export async function findLogs(
  query: FilterQuery<LogDocument>,
  options?: ServiceOptions
) {
  return LogModel.find(query)
    .populate(options?.populate || defaultPopulate)
    .limit(1000)
    .sort({ createdAt: -1 })
    .lean();
}
