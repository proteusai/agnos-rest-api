import { NextFunction, Request, Response } from "express";
import logger from "@utils/logger";
import errorObject from "@utils/error";
import { MapRoleToValue, ResourceIdLocation, RoleName } from "@constants/permissions";
import { Obj } from "@types";
import { findMembership } from "@services/membership";
import { ACCESS_FORBIDDEN } from "@constants/errors";

const requireUserRole =
  (role: RoleName, idLocation: ResourceIdLocation) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      // get the org id from the request
      const [obj, key] = idLocation.split(".");
      const id = ((req as unknown as Obj)[obj] as Obj)[key];

      // get the user's org membership
      const membership = await findMembership({
        user: res.locals.user?._id,
        org: id,
        team: { $eq: null },
        role: { $ne: null },
      });

      // ensure the user's role is at least the required role
      if (!membership || !membership.role || MapRoleToValue[membership.role] < MapRoleToValue[role]) {
        throw new Error(ACCESS_FORBIDDEN);
      }

      return next();
    } catch (error: unknown) {
      logger.error(error);
      return res.status(403).send({ error: errorObject(error) });
    }
  };

export default requireUserRole;
