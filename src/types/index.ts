import { Response as ExpressResponse } from "express";
import { UserDocument } from "@models/user";
import { ObjectId, UpdateWriteOpResult } from "mongoose";

export type Obj = Record<string, unknown>;

export type ResponseLocals = { user?: UserDocument & { session?: ObjectId } };

export type ResponseMeta = { result?: UpdateWriteOpResult };

export type Response<T> = ExpressResponse<
  { data?: T | null; error?: Pick<Error, "name" | "message">; meta?: ResponseMeta },
  ResponseLocals
>;
