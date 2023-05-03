import request from "supertest";
import app from "@app";
import { connect, disconnect } from "@utils/connect";
import { Request, Response, NextFunction } from "express";
import { findOrg } from "@services/org";
import { findSettings } from "@services/settings";

jest.mock("@middleware/checkAuth0IdToken", () => (_: Request, __: Response, next: NextFunction) => {
  return next();
});
jest.mock("@middleware/checkAuth0AccessToken", () => (_: Request, __: Response, next: NextFunction) => {
  return next();
});

describe("User routes", () => {
  beforeAll(async () => {
    await connect();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await disconnect();
  });

  describe("POST /users", () => {
    it("should return 409 if the user already exists", async () => {
      const body = {
        name: "John Doe",
        email: "john.doe@example.com",
      };
      await request(app).post("/users").send(body);
      const response = await request(app).post("/users").send(body);
      expect(response.status).toBe(409);
      expect(response.body.error).toBeDefined();
    });

    it("should create a new user", async () => {
      const body = {
        name: "John Doe",
        email: "john.doe2@example.com",
      };
      const response = await request(app).post("/users").send(body);
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty("_id");
      expect(response.body.data).toHaveProperty("name", body.name);
      expect(response.body.data).toHaveProperty("email", body.email);

      // Check that the user has an auto-created personal org
      const org = await findOrg({ user: response.body.data._id, personal: true });
      expect(org).toBeDefined();

      // Check that the user has an auto-created settings document
      const settings = await findSettings({ user: response.body.data._id });
      expect(settings).toBeDefined();
    });
  });
});
