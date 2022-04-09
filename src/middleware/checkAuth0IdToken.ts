import { NextFunction, Request, Response } from "express";
import config from "config";
import { CreateSessionInput } from "../schema/session.schema";

const checkAuth0IdToken = async (
  req: Request<{}, {}, CreateSessionInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  const idToken = req.body.idToken;

  if (!idToken) {
    return res.status(401).send({ error: { message: "Missing ID token" } });
  }

  const payload = await parseJwt(idToken);

  const audMatch = payload.aud === config.get("auth0ClientId");
  const emailMatch = payload.email === req.body.email;

  if (!audMatch || !emailMatch) {
    return res.status(401).send({ error: { message: "Invalid ID token" } });
  }

  return next();
};

function parseJwt(token: string) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
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
