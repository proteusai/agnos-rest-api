import { Request } from "express";
import { IGNORE_LEAST_CARDINALITY } from "@constants/settings";
import { findUserDocument } from "@services/user";
import { Obj, Response } from "@types";
import { FilterQuery, LeanDocument, ObjectId } from "mongoose";
import errorObject from "@utils/error";
import logger from "@utils/logger";
import { OrgDocument } from "@models/org";
import { findOrgDocument } from "@services/org";
import { COMPONENT_NOT_FOUND, ORG_NOT_FOUND } from "@constants/errors";
import { createCollaboration } from "@services/collaboration";
import { PermissionName, PermissionScope } from "@constants/permissions";
import { ServiceOptions } from "@services";
import { CreateComponentRequest, GetComponentRequest } from "@schemas/component";
import { ComponentDocument } from "@models/component";
import { createComponentDocument, findComponent, findComponents } from "@services/component";

export async function createComponentHandler(
  req: Request<Obj, Obj, CreateComponentRequest["body"]>,
  res: Response<LeanDocument<ComponentDocument & { _id: ObjectId }>>
) {
  try {
    const userId = res.locals.user?._id;
    const userDoc = await findUserDocument({ _id: userId });

    let org:
      | (OrgDocument & {
          _id: ObjectId;
        })
      | null = null;
    if (req.body.org) {
      org = await findOrgDocument({ _id: req.body.org });
    } else {
      org = await findOrgDocument({ user: userId, personal: true });
    }
    if (!org) {
      throw new Error(ORG_NOT_FOUND);
    }

    const componentDoc = await createComponentDocument({
      ...req.body,
      scopes: req.body.scopes?.map((scope) => PermissionScope[scope]),
      user: userId,
      org: org._id,
      personal: org.personal,
    });
    const collaboration = await createCollaboration({
      org: org._id,
      permission: PermissionName.admin,
      component: componentDoc._id,
      user: userId,
    });

    if (IGNORE_LEAST_CARDINALITY) {
      userDoc?.collaborations?.push(collaboration);
      await userDoc?.save();
      componentDoc.collaborations?.push(collaboration);
      await componentDoc.save();
      org.collaborations?.push(collaboration);
      org.components?.push(componentDoc);
      await org.save();
    }

    const component = await findComponent({ _id: componentDoc._id });

    return res.send({ data: component });
  } catch (error: unknown) {
    logger.error(error);
    return res.status(404).send({ error: errorObject(error) });
  }
}

export async function getComponentHandler(
  req: Request<GetComponentRequest["params"]>,
  res: Response<LeanDocument<ComponentDocument & { _id: ObjectId }>>
) {
  try {
    const parsedQuery = (res.locals as Obj).query;
    const component = await findComponent({ _id: req.params.component }, parsedQuery as ServiceOptions);

    if (!component) {
      throw new Error(COMPONENT_NOT_FOUND);
    }

    return res.send({ data: component });
  } catch (error: unknown) {
    logger.error(error);
    return res.status(404).send({ error: errorObject(error) });
  }
}

export async function getComponentsHandler(
  req: Request,
  res: Response<LeanDocument<Array<ComponentDocument & { _id: ObjectId }>>>
) {
  const parsedQuery = (res.locals as Obj).query;

  const components = await findComponents(
    { ...((parsedQuery as Obj).filter as Obj), private: false } as FilterQuery<ComponentDocument>,
    parsedQuery as ServiceOptions
  );

  const size = (parsedQuery as Obj).limit as number;
  const page = ((parsedQuery as Obj).skip as number) / size + 1; // skip = (page - 1) * size // => page = skip / size + 1
  return res.send({
    data: components,
    meta: { pagination: { size, page, prev: Math.max(0, page - 1), next: page + 1 } },
  });
}
