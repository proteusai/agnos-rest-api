import { Request } from "express";
import { createSession, findSessions, updateSession } from "@services/session";
import { findUser } from "@services/user";
import { CreateSessionRequest } from "@schemas/session";
import { Obj, Response } from "@types";
import { ACCESS_TOKEN_INVALID } from "@constants/errors";
import { SessionDocument } from "../model/session.model";
import { LeanDocument, ObjectId } from "mongoose";

export async function createUserSessionHandler(
  req: Request<Obj, Obj, CreateSessionRequest["body"]>,
  res: Response<LeanDocument<SessionDocument & { _id: ObjectId }>>
) {
  const { accessToken, email } = req.body;

  const user = await findUser({ email });

  if (!user) {
    return res.status(401).send({ error: { message: ACCESS_TOKEN_INVALID } });
  }

  const userId = user._id;
  const userAgent = req.get("user-agent") || "";

  const session = await createSession({
    user: userId,
    email,
    accessToken,
    userAgent,
  });

  return res.send({ data: session });
}

export async function getUserSessionsHandler(
  req: Request,
  res: Response<LeanDocument<Array<SessionDocument & { _id: ObjectId }>>>
) {
  const userId = res.locals.user?._id;

  const sessions = await findSessions({ userId, valid: true });

  return res.send({ data: sessions });
}

export async function deleteSessionHandler(
  req: Request,
  res: Response<LeanDocument<SessionDocument & { _id: ObjectId }>>
) {
  const session = res.locals.user?.session;

  await updateSession({ _id: session }, { valid: false });

  return res.status(204).send();
}
