import { Request } from "express";
import { RoleName } from "@constants/permissions";
import { IGNORE_LEAST_CARDINALITY } from "@constants/settings";
import { CreateOrgRequest, GetOrgRequest, GetOrgsRequest } from "@schemas/org";
import { createMembership } from "../../../service/membership.service";
import { createOrgDocument, findOrg, findOrgs } from "@services/org";
import { findUserDocument } from "@services/user";
import { Obj, Response } from "@types";
import { OrgDocument } from "@models/org";
import { LeanDocument, ObjectId } from "mongoose";

export async function createOrgHandler(
  req: Request<Obj, Obj, CreateOrgRequest["body"]>,
  res: Response<LeanDocument<OrgDocument & { _id: ObjectId }>>
) {
  const userId = res.locals.user?._id;
  const userDoc = await findUserDocument({ _id: userId });

  const orgDoc = await createOrgDocument({ ...req.body, user: userId });
  const membership = await createMembership({
    user: userId,
    org: orgDoc._id,
    role: RoleName.OWNER,
  });

  if (IGNORE_LEAST_CARDINALITY) {
    userDoc?.memberships?.push(membership);
    await userDoc?.save();
    orgDoc.memberships?.push(membership);
    await orgDoc.save();
  }

  const org = await findOrg({ _id: orgDoc._id });

  return res.send({ data: org });
}

export async function getOrgHandler(
  req: Request<GetOrgRequest["params"]>,
  res: Response<LeanDocument<OrgDocument & { _id: ObjectId }>>
) {
  const org = await findOrg({ _id: req.params.id });

  if (!org) {
    return res.sendStatus(404);
  }

  return res.send({ data: org });
}

export async function getOrgsHandler(
  req: Request<Obj, Obj, Obj, GetOrgsRequest["query"]>,
  res: Response<LeanDocument<Array<OrgDocument & { _id: ObjectId }>>>
) {
  let populate: string[] | undefined = undefined; // TODO: move this to a middleware; put it in res.locals
  if (req.query.populate) {
    populate = req.query.populate.split(";");
  }

  const orgs = await findOrgs({}, { populate });
  return res.send({ data: orgs });
}

export async function getMyOrgHandler(
  req: Request<Obj, Obj, Obj, GetOrgsRequest["query"]>,
  res: Response<LeanDocument<OrgDocument & { _id: ObjectId }>>
) {
  let populate: string[] | undefined = undefined;
  if (req.query.populate) {
    populate = req.query.populate.split(";");
  }

  const userId = res.locals.user?._id;

  const org = await findOrg({ personal: true, user: userId });
  return res.send({ data: org });
}
