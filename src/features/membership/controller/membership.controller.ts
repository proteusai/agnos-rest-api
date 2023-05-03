import { Request } from "express";
import { findMemberships } from "@services/membership";
import { Obj, Response } from "@types";
import { FilterQuery, LeanDocument, ObjectId } from "mongoose";
import { MembershipDocument } from "@models/membership";
import { ServiceOptions } from "@services";

export async function getMembershipsHandler(
  req: Request,
  res: Response<LeanDocument<Array<MembershipDocument & { _id: ObjectId }>>>
) {
  const userId = res.locals.user?._id;
  const parsedQuery = (res.locals as Obj).query;

  const memberships = await findMemberships(
    { ...((parsedQuery as Obj).filter as Obj), user: userId } as FilterQuery<MembershipDocument>,
    parsedQuery as ServiceOptions
  );

  const size = (parsedQuery as Obj).limit as number;
  const page = ((parsedQuery as Obj).skip as number) / size + 1; // skip = (page - 1) * size // => page = skip / size + 1
  return res.send({
    data: memberships,
    meta: { pagination: { size, page, prev: Math.max(0, page - 1), next: page + 1 } },
  });
}
