import { Request, Response } from "express";
import {
  CreateMembershipInput,
  GetMembershipsInput,
} from "../schema/membership.schema";
import {
  createMembership,
  findMemberships,
} from "../service/membership.service";

export async function createMembershipHandler(
  req: Request<{}, {}, CreateMembershipInput["body"]>,
  res: Response
) {
  const membership = await createMembership(req.body);
  return res.send({ membership });
}

export async function getMyMembershipsHandler(
  req: Request<{}, {}, {}, GetMembershipsInput["query"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  let populate: string[] | undefined = undefined;
  if (req.query.populate) {
    populate = req.query.populate.split(";");
  }
  const memberships = await findMemberships({ user: userId }, { populate });
  return res.send({ memberships });
}
