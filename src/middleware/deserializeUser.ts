import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import { findSession } from "@services/session.service";

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = get(req, "headers.authorization", "").replace(/^Bearer\s/, "");

  if (!accessToken) {
    return next();
  }

  const session = await findSession({ accessToken, valid: true });

  if (!session) {
    return next();
  }

  res.locals.user = {
    _id: session.user,
    session: session._id,
  };
  return next();
};

export default deserializeUser;
