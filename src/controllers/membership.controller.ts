import { Request, Response } from "express";
import { CreateMembershipInput } from "../schema/membership.schema";
import {
  createMembership,
  findUserMemberships,
} from "../service/membership.service";

export async function createMembershipHandler(
  req: Request<{}, {}, CreateMembershipInput["body"]>,
  res: Response
) {
  const membership = await createMembership(req.body);
  return res.send({ membership });
}

export async function findMyMembershipsHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;
  const memberships = await findUserMemberships(userId);
  return res.send({ memberships });
}
