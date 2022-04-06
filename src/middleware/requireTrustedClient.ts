/**
 * This API server expects that not all users will log in using passwords.
 * Some users will log in from a "trusted client" which uses an external service
 * (like AWS Cognito or Auth0) which does not expose the user's password to the client.
 * Consequently, the client cannot make a request to this server with the user's password.
 *
 * This middleware checks the incoming request's hostname to ensure it's a trusted client.
 * This check is only performed when the server is running in production mode.
 *
 * This middleware should apply to any route that sends back tokens (access or refresh)
 * to the client without enforcing the presence of a password in the request.
 */

import config from "config";
import { Request, Response, NextFunction } from "express";
import { CreateSessionInput } from "../schema/session.schema";

const requireTrustedClient = (
  req: Request<{}, {}, CreateSessionInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  const trustHostnames = ["api.agnos.com"];
  if (config.get("nodeEnv") === "production") {
    if (!trustHostnames.includes(req.hostname) && !req.body.password) {
      return res.sendStatus(403);
    }
  }

  return next();
};

export default requireTrustedClient;
