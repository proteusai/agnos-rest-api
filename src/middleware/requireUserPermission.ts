import { NextFunction, Request, Response } from "express";
import logger from "@utils/logger";
import errorObject from "@utils/error";
import { ResourceIdLocation, ResourceTypes, PermissionName, MapPermissionToValue } from "@constants/permissions";
import { Obj } from "@types";
import { ACCESS_FORBIDDEN } from "@constants/errors";
import { findCollaboration } from "@services/collaboration";
import { findMemberships } from "@/service/membership.service";

const requireUserPermission =
  (permission: PermissionName, resource: ResourceTypes, idLocation: ResourceIdLocation) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // get the resource id from the request
      const [obj, key] = idLocation.split(".");
      const id = ((req as unknown as Obj)[obj] as Obj)[key];

      // get the user's resource collaboration
      const collaboration = await findCollaboration({
        user: res.locals.user?._id,
        ...(resource === "project" && { project: id }),
        team: { $eq: null },
        permission: { $ne: null },
      });

      if (
        collaboration &&
        collaboration.permission &&
        MapPermissionToValue[collaboration.permission] >= MapPermissionToValue[permission]
      ) {
        return next();
      }

      // get the user's team memberships
      const memberships = await findMemberships({
        user: res.locals.user?._id,
        team: { $ne: null },
      });

      for (const membership of memberships) {
        // get the user's team collaboration
        const collaboration = await findCollaboration({
          user: { $eq: null },
          ...(resource === "project" && { project: id }),
          team: membership.team,
          permission: { $ne: null },
        });

        if (
          collaboration &&
          collaboration.permission &&
          MapPermissionToValue[collaboration.permission] >= MapPermissionToValue[permission]
        ) {
          return next();
        }
      }

      throw new Error(ACCESS_FORBIDDEN);
    } catch (error: unknown) {
      logger.error(error);
      return res.status(403).send({ error: errorObject(error) });
    }
  };

export default requireUserPermission;
