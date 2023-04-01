import { FilterQuery, UpdateQuery } from "mongoose";
import SessionModel, { SessionDocument, SessionInput } from "@models/session.model";
import { connect, disconnect } from "@utils/connect";
import { createSession, findSession, findSessions, updateSession } from "@services/session.service";

describe("Session service", () => {
  const input: SessionInput = {
    user: "5f9f1c5b9b9b9b9b9b9b9b9b",
    email: "example@email.com",
    accessToken: "accessToken",
  };

  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await SessionModel.collection.drop();
    await disconnect();
  });

  describe("createSession", () => {
    it("should create a session", async () => {
      const session = await createSession(input);
      expect(session).toBeDefined();
      expect(session._id).toBeDefined();
      expect(String(session.user)).toBe(String(input.user));
      expect(session.email).toBe(input.email);
      expect(session.accessToken).toBe(input.accessToken);
      // should have a default "valid" value of true
      expect(session.valid).toBe(true);
      // should not have a default "userAgent" value
      expect(session.userAgent).toBeUndefined();
    });
  });

  describe("findSession", () => {
    it("should find a session by query", async () => {
      const session = await createSession(input);
      const query: FilterQuery<SessionDocument> = {
        _id: session._id,
      };
      const foundSession = await findSession(query);
      expect(foundSession).toBeDefined();
      expect(String(foundSession?.user)).toBe(String(session.user));
      expect(foundSession?.email).toBe(session.email);
      expect(foundSession?.accessToken).toBe(session.accessToken);
    });
  });

  describe("findSessions", () => {
    it("should find sessions by query", async () => {
      const query: FilterQuery<SessionDocument> = {
        user: input.user,
      };
      const sessions = await findSessions(query);
      expect(sessions).toBeDefined();
      // we have some sessions in the database from the tests above
      expect(sessions.length).toBeGreaterThan(0);
    });
  });

  describe("updateSession", () => {
    it("should update a session by query", async () => {
      const query: FilterQuery<SessionDocument> = {
        user: "5f9f1c5b9b9b9b9b9b9b9b9c",
      };
      const update: UpdateQuery<SessionDocument> = {
        valid: false,
      };
      await createSession({ ...input, user: "5f9f1c5b9b9b9b9b9b9b9b9c" });
      const result = await updateSession(query, update);
      expect(result).toBeDefined();
      expect(result.modifiedCount).toBe(1);
      const foundSession = await findSession(query);
      expect(foundSession?.valid).toBe(false);
    });
  });
});
