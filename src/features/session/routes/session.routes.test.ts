import request from "supertest";
import app from "@app";
import { connect, disconnect } from "@utils/connect";
import { ACCESS_TOKEN_INVALID } from "@constants/errors";
import { Request, Response, NextFunction } from "express";
import { createUserHandler } from "@controllers/user";

jest.mock("@middleware/checkAuth0IdToken", () => (_: Request, __: Response, next: NextFunction) => {
  return next();
});
jest.mock("@middleware/checkAuth0AccessToken", () => (_: Request, __: Response, next: NextFunction) => {
  return next();
});

describe("Session routes", () => {
  beforeAll(async () => {
    await connect();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await disconnect();
  });

  describe("POST /sessions", () => {
    it("should return 400 if the request body has missing field (e.g. idToken)", async () => {
      const body = {
        email: "test@example.com",
        accessToken: "valid-access-token",
      };
      const response = await request(app).post("/sessions").send(body);
      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.name).toBeDefined();
      expect(response.body.error.name).toBe("ZodError");
    });

    it("should return 401 if the user cannot be found", async () => {
      const body = {
        email: "test@example.com",
        accessToken: "valid-access-token",
        idToken: "test-id-token",
      };
      const response = await request(app).post("/sessions").send(body);
      expect(response.status).toBe(401);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toBeDefined();
      expect(response.body.error.message).toBe(ACCESS_TOKEN_INVALID);
    });

    it("should create a session for a valid user", async () => {
      const req = {
        body: {
          name: "John Doe",
          email: "john.doe@example.com",
          password: "password123",
        },
      } as unknown as Request;
      const res = {
        send: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;
      await createUserHandler(req, res);

      const body = {
        email: "john.doe@example.com",
        accessToken: "valid-access-token",
        idToken: "test-id-token", // this is possible because we mocked the auth middleware
      };
      const response = await request(app).post("/sessions").send(body);
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty("_id");
      expect(response.body.data).toHaveProperty("user");
      expect(response.body.data.email).toBe(body.email);
      expect(response.body.data.accessToken).toBe(body.accessToken);
    });
  });
});
