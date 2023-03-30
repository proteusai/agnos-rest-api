import { Request, Response } from "express";
import { createUserSessionHandler, getUserSessionsHandler, deleteSessionHandler } from "./session.controller";
import { createSession, findSessions, updateSession } from "../service/session.service";
import { findUser } from "../service/user.service";
import { CreateSessionRequest } from "../schema/session.schema";
import { Obj } from "../types";
import mongoose from "mongoose";

jest.mock("../service/user.service");
jest.mock("../service/session.service");

const mockedFindUser = findUser as jest.MockedFunction<typeof findUser>;
const mockedCreateSession = createSession as jest.MockedFunction<typeof createSession>;
const mockedFindSessions = findSessions as jest.MockedFunction<typeof findSessions>;
const mockedUpdateSession = updateSession as jest.MockedFunction<typeof updateSession>;

describe("Session controller", () => {
  describe("createUserSessionHandler", () => {
    const req = {
      body: { email: "test@example.com", accessToken: "test-token" },
      get: jest.fn().mockReturnValue(""),
    } as unknown as Request<Obj, Obj, CreateSessionRequest["body"]>;
    let res = { send: jest.fn(), status: jest.fn().mockReturnThis() } as unknown as Response;

    beforeEach(() => {
      mockedFindUser.mockClear();
      mockedCreateSession.mockClear();
      res = { send: jest.fn(), status: jest.fn().mockReturnThis() } as unknown as Response;
    });

    test("returns error if user not found", async () => {
      mockedFindUser.mockResolvedValueOnce(null);

      await createUserSessionHandler(req, res);

      expect(mockedFindUser).toHaveBeenCalledTimes(1);
      expect(mockedFindUser).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith({ error: { message: "Invalid access token" } });
    });

    test("creates session and returns it", async () => {
      mockedFindUser.mockResolvedValueOnce({
        _id: "user-id",
        name: "Test User",
        email: "test@example.com",
        comparePassword: jest.fn(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockedCreateSession.mockResolvedValueOnce({
        _id: "session-id",
        user: "user-id",
        email: "test@example.com",
        accessToken: "test-token",
        userAgent: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await createUserSessionHandler(req, res);

      expect(mockedFindUser).toHaveBeenCalledTimes(1);
      expect(mockedFindUser).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(mockedCreateSession).toHaveBeenCalledTimes(1);
      expect(mockedCreateSession).toHaveBeenCalledWith({
        user: "user-id",
        email: "test@example.com",
        accessToken: "test-token",
        userAgent: "",
      });
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith({
        data: expect.objectContaining({
          _id: "session-id",
          user: "user-id",
          email: "test@example.com",
          accessToken: "test-token",
          userAgent: "",
        }),
      });
    });
  });
});

describe("getUserSessionsHandler", () => {
  const req = {} as Request;
  const res = { send: jest.fn() } as unknown as Response;
  const mockedSessions = [
    {
      _id: "session-id",
      user: "user-id",
      email: "test@example.com",
      accessToken: "test-token",
      valid: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    mockedFindSessions.mockClear();
  });

  test("returns user sessions", async () => {
    mockedFindSessions.mockResolvedValueOnce(mockedSessions);

    res.locals = { user: { _id: "user-id" } };

    await getUserSessionsHandler(req, res);

    expect(mockedFindSessions).toHaveBeenCalledTimes(1);
    expect(mockedFindSessions).toHaveBeenCalledWith({ userId: "user-id", valid: true });
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith({ data: mockedSessions });
  });
});

describe("deleteSessionHandler", () => {
  const req = {} as Request;
  const res = { send: jest.fn(), status: jest.fn().mockReturnThis() } as unknown as Response;

  beforeEach(() => {
    mockedUpdateSession.mockClear();
  });

  test("soft-deletes user sessions", async () => {
    mockedUpdateSession.mockResolvedValueOnce({
      acknowledged: true,
      modifiedCount: 1,
      matchedCount: 1,
      upsertedCount: 1,
      upsertedId: new mongoose.Types.ObjectId(),
    });

    res.locals = { user: { session: "testSessionId" } };

    await deleteSessionHandler(req, res);

    expect(mockedUpdateSession).toHaveBeenCalledTimes(1);
    expect(mockedUpdateSession).toHaveBeenCalledWith({ _id: "testSessionId" }, { valid: false });
    expect(res.send).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(204);
  });
});
