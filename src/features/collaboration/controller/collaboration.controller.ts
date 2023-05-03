import { Request } from "express";
import { Obj, Response } from "@types";
import { FilterQuery, LeanDocument, ObjectId } from "mongoose";
import { CollaborationDocument } from "@models/collaboration";
import { findCollaborations } from "@services/collaboration";
import { ServiceOptions } from "@services";

export async function getCollaborationsHandler(
  req: Request,
  res: Response<LeanDocument<Array<CollaborationDocument & { _id: ObjectId }>>>
) {
  const userId = res.locals.user?._id;
  const parsedQuery = (res.locals as Obj).query;

  const collaborations = await findCollaborations(
    { ...((parsedQuery as Obj).filter as Obj), user: userId } as FilterQuery<CollaborationDocument>,
    parsedQuery as ServiceOptions
  );

  const size = (parsedQuery as Obj).limit as number;
  const page = ((parsedQuery as Obj).skip as number) / size + 1; // skip = (page - 1) * size // => page = skip / size + 1
  return res.send({
    data: collaborations,
    meta: { pagination: { size, page, prev: Math.max(0, page - 1), next: page + 1 } },
  });
}
