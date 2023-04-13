import { Request, Response } from "express";
import { RoleName } from "@constants/permissions";
import { IGNORE_LEAST_CARDINALITY } from "@constants/settings";
import { CreateOrgRequest, GetOrgRequest, GetOrgsRequest } from "@schemas/org";
import { createMembership } from "../../../service/membership.service";
import { createOrgDocument, findOrg, findOrgs } from "@services/org";
import { findUserDocument } from "@services/user";
import { Obj } from "@types";

export async function createOrgHandler(req: Request<Obj, Obj, CreateOrgRequest["body"]>, res: Response) {
  const user = res.locals.user;
  const userDoc = await findUserDocument({ _id: user._id });

  const org = await createOrgDocument({ ...req.body, user: user._id });
  const membership = await createMembership({
    user: user._id,
    org: org._id,
    role: RoleName.OWNER,
  });

  if (IGNORE_LEAST_CARDINALITY) {
    userDoc?.memberships?.push(membership);
    await userDoc?.save();
    org.memberships?.push(membership);
    await org.save();
  }

  return res.send({ data: org.toJSON() });
}

export async function getOrgHandler(req: Request<GetOrgRequest["params"]>, res: Response) {
  const org = await findOrg({ _id: req.params.id });

  if (!org) {
    return res.sendStatus(404);
  }

  return res.send({ data: org });
}

export async function getOrgsHandler(req: Request<Obj, Obj, Obj, GetOrgsRequest["query"]>, res: Response) {
  let populate: string[] | undefined = undefined; // TODO: move this to a middleware; put it in res.locals
  if (req.query.populate) {
    populate = req.query.populate.split(";");
  }

  const orgs = await findOrgs({}, { populate });
  return res.send({ data: orgs });
}

export async function getMyOrgHandler(req: Request<Obj, Obj, Obj, GetOrgsRequest["query"]>, res: Response) {
  let populate: string[] | undefined = undefined;
  if (req.query.populate) {
    populate = req.query.populate.split(";");
  }

  const user = res.locals.user;

  const org = await findOrg({ personal: true, user: user._id });
  return res.send({ data: org });
}
