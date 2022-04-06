import { get } from "lodash";
import config from "config";
import { FilterQuery, UpdateQuery } from "mongoose";
import SessionModel, { SessionDocument } from "../models/session.model";
import { verifyJwt, signJwt } from "../utils/jwt.utils";
import { findUser } from "./user.service";

export async function createSession(userId: string, userAgent: string) {
  const session = await SessionModel.create({ userId, userAgent });

  return session.toJSON();
}

export async function findSessions(query: FilterQuery<SessionDocument>) {
  return SessionModel.find(query).lean();
}

export async function updateSession(
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
) {
  return SessionModel.updateOne(query, update);
}

export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  const { decoded } = verifyJwt(refreshToken, "refreshTokenPublicKey");

  if (!decoded || !get(decoded, "sessionId")) return false;

  const session = await SessionModel.findById(get(decoded, "sessionId"));

  if (!session || !session.valid) return false;

  const user = await findUser({ _id: session.userId });

  if (!user) return false;

  const accessToken = signJwt(
    { ...user, sessionId: session._id },
    "accessTokenPrivateKey",
    { expiresIn: config.get("accessTokenTtl") }
  );

  return accessToken;
}
