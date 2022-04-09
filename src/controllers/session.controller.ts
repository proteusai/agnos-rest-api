import { Request, Response } from "express";
import {
  createSession,
  findSessions,
  updateSession,
} from "../service/session.service";
import { findUser } from "../service/user.service";
import { CreateSessionInput } from "../schema/session.schema";

export async function createUserSessionHandler(
  req: Request<{}, {}, CreateSessionInput["body"]>,
  res: Response
) {
  const email = req.body.email;
  const accessToken = req.body.accessToken;

  const user = await findUser({ email });

  if (!user) {
    return res.status(401).send({ error: { message: "Invalid access token" } });
  }

  const userId = user._id;
  const userAgent = req.get("user-agent") || "";

  const session = await createSession({
    userId,
    email,
    accessToken,
    userAgent,
  });

  return res.send({ session });
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;

  const sessions = await findSessions({ userId, valid: true });

  return res.send({ sessions });
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.sessionId;

  await updateSession({ _id: sessionId }, { valid: false });

  return res.status(204).send();
}
