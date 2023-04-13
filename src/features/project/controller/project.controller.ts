import { Request } from "express";
import { IGNORE_LEAST_CARDINALITY } from "@constants/settings";
import { CreateProjectRequest, GetProjectRequest, GetProjectsRequest } from "@schemas/project";
import { createProjectDocument, findProject, findProjects } from "@services/project";
import { findUserDocument } from "@services/user";
import { Obj, Response } from "@types";
import { LeanDocument, ObjectId } from "mongoose";
import { ProjectDocument } from "@models/project";
import errorObject from "@utils/error";
import logger from "@utils/logger";
import { OrgDocument } from "@models/org";
import { findOrgDocument } from "@services/org";
import { ORG_NOT_FOUND, PROJECT_NOT_FOUND } from "@/constants/errors";
import { createCollaboration } from "@services/collaboration";
import { PermissionName } from "@/constants/permissions";

export async function createProjectHandler(
  req: Request<Obj, Obj, CreateProjectRequest["body"]>,
  res: Response<LeanDocument<ProjectDocument & { _id: ObjectId }>>
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

    const projectDoc = await createProjectDocument({ ...req.body, user: userId, org: org._id });
    const collaboration = await createCollaboration({
      org: org._id,
      permission: PermissionName.ADMIN,
      project: projectDoc._id,
      user: userId,
    });

    if (IGNORE_LEAST_CARDINALITY) {
      userDoc?.collaborations?.push(collaboration);
      await userDoc?.save();
      projectDoc.collaborations?.push(collaboration);
      await projectDoc.save();
      org.collaborations?.push(collaboration);
      org.projects?.push(projectDoc);
      await org.save();
    }

    const project = await findProject({ _id: projectDoc._id });

    return res.send({ data: project });
  } catch (error: unknown) {
    logger.error(error);
    return res.status(404).send({ error: errorObject(error) });
  }
}

export async function getProjectHandler(
  req: Request<GetProjectRequest["params"]>,
  res: Response<LeanDocument<ProjectDocument & { _id: ObjectId }>>
) {
  try {
    const project = await findProject({ _id: req.params.id });

    if (!project) {
      throw new Error(PROJECT_NOT_FOUND);
    }

    return res.send({ data: project });
  } catch (error: unknown) {
    logger.error(error);
    return res.status(404).send({ error: errorObject(error) });
  }
}

export async function getProjectsHandler(
  req: Request<Obj, Obj, Obj, GetProjectsRequest["query"]>,
  res: Response<LeanDocument<Array<ProjectDocument & { _id: ObjectId }>>>
) {
  let populate: string[] | undefined = undefined;
  if (req.query.populate) {
    populate = req.query.populate.split(";");
  }

  const projects = await findProjects({}, { populate });

  return res.send({ data: projects });
}
