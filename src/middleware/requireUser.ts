import { ACCESS_UNAUTHORIZED } from "@/constants/errors";
import { Request, Response, NextFunction } from "express";

const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;

  if (!user) {
    return res.status(401).send({ error: { message: ACCESS_UNAUTHORIZED } });
  }

  return next();
};

export default requireUser;
