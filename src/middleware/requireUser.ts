import { ACCESS_FORBIDDEN } from "@/constants/errors";
import { Request, Response, NextFunction } from "express";

const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;

  if (!user) {
    return res.status(403).send({ error: { message: ACCESS_FORBIDDEN } });
  }

  return next();
};

export default requireUser;
