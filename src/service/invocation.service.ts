import { FilterQuery } from "mongoose";
import { ServiceOptions } from ".";
import { websocket } from "../app";
import { Env } from "../constants/env";
import InvocationModel, { InvocationDocument, InvocationInput } from "../models/invocation.model";

const defaultPopulate: string[] = [];

export async function createInvocation(input: InvocationInput, options?: { accessToken?: string }) {
  const invocation = await createInvocationDocument(input, options);

  return invocation.toJSON();
}
export async function createInvocationDocument(input: InvocationInput, options?: { accessToken?: string }) {
  const invocation = await InvocationModel.create({
    ...input,
    ...(input.env === Env.TEST && { expiresAt: new Date() }),
  });

  websocket.emit(`invocation:${invocation.function}`, invocation);
  websocket.emit(`invocation:${invocation.version}`, invocation);
  if (invocation.meta && invocation.meta["user"])
    websocket.emit(`invocation:${invocation.meta["user"]}@${invocation.version}`, invocation);
  if (options?.accessToken) websocket.emit(`invocation:${options.accessToken}@${invocation.version}`, invocation);

  return invocation;
}

export async function findInvocation(query: FilterQuery<InvocationDocument>) {
  return InvocationModel.findOne(query).lean();
}

export async function findInvocations(query: FilterQuery<InvocationDocument>, options?: ServiceOptions) {
  return InvocationModel.find(query)
    .populate(options?.populate || defaultPopulate)
    .limit(1000)
    .sort({ createdAt: -1 })
    .lean();
}
