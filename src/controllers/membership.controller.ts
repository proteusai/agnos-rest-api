import { Request, Response } from "express";
import { RoleName } from "../constants/permissions";
import { CreateMembershipInput, GetMembershipsInput } from "../schema/membership.schema";
import { createMembership, findMemberships } from "../service/membership.service";
import { Obj } from "../types";

export async function createMembershipHandler(req: Request<Obj, Obj, CreateMembershipInput["body"]>, res: Response) {
  const membership = await createMembership({
    ...req.body,
    role: RoleName[req.body.role],
  });
  return res.send({ membership });
}

export async function getMyMembershipsHandler(
  req: Request<Obj, Obj, Obj, GetMembershipsInput["query"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  let populate: string[] | undefined = undefined;
  if (req.query.populate) {
    populate = req.query.populate.split(";");
  }
  const memberships = await findMemberships({ user: userId });
  return res.send({ memberships });
}
