import { Response as ExpressResponse } from "express";
import { UserDocument } from "@models/user";
import { ObjectId, UpdateWriteOpResult } from "mongoose";

export type Obj = Record<string, unknown>;

export type Pagination = { size: number; page: number; next?: number; prev?: number };

export type ResponseLocals = { user?: UserDocument & { session?: ObjectId } };

export type ResponseMeta = { pagination?: Pagination; result?: UpdateWriteOpResult };

export type Response<T> = ExpressResponse<
  { data?: T | null; error?: Pick<Error, "name" | "message">; meta?: ResponseMeta },
  ResponseLocals
>;
