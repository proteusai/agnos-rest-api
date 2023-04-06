import { NextFunction, Request, Response } from "express";
import config from "config";
import { CreateSessionRequest } from "@schemas/session";
import { Obj } from "@types";
import { ID_TOKEN_INVALID, ID_TOKEN_MISSING } from "@constants/errors";
import logger from "@utils/logger";
import errorObject from "@utils/error";

const checkAuth0IdToken = async (
  req: Request<Obj, Obj, CreateSessionRequest["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      throw new Error(ID_TOKEN_MISSING);
    }

    const payload = await parseJwt(idToken);

    const audMatch = payload.aud === config.get("auth0ClientId");
    const emailMatch = payload.email === req.body.email;

    if (!audMatch || !emailMatch) {
      throw new Error(ID_TOKEN_INVALID);
    }

    return next();
  } catch (error: unknown) {
    logger.error(error);
    return res.status(401).send({ error: errorObject(error) });
  }
};

function parseJwt(token: string) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    Buffer.from(base64, "base64")
      .toString()
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export default checkAuth0IdToken;

/**
 * https://stackoverflow.com/questions/23097928/node-js-throws-btoa-is-not-defined-error
 */
