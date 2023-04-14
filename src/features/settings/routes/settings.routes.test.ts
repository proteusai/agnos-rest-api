import request from "supertest";
import app from "@app";
import { connect, disconnect } from "@utils/connect";
import PermissionModel from "../../../models/permission.model";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { findUserDocument } from "@services/user";
import { mockMongooseDocument } from "@mocks/mongoose";

jest.mock("@services/user");
jest.mock("@middleware/checkAuth0IdToken", () => (_: Request, __: Response, next: NextFunction) => {
  return next();
});
jest.mock("@middleware/checkAuth0AccessToken", () => (_: Request, __: Response, next: NextFunction) => {
  return next();
});
jest.mock("@middleware/deserializeUser", () => (_: Request, res: Response, next: NextFunction) => {
  res.locals.user = {
    _id: new mongoose.Types.ObjectId(),
    session: new mongoose.Types.ObjectId(),
  };
  return next();
});
const mockedFindUser = findUserDocument as jest.MockedFunction<typeof findUserDocument>;
const mockedUserDoc = {
  _id: new mongoose.Types.ObjectId(),
  name: "John Doe",
  email: "john.doe22@example.com",
  password: "password123",
  comparePassword: jest.fn(),
  createdAt: new Date(),
  updatedAt: new Date(),
  ...mockMongooseDocument,
};

describe("Settings routes", () => {
  beforeAll(async () => {
    await connect();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await PermissionModel.collection.drop();
    await disconnect();
  });

  describe("GET /settings", () => {
    it("should return existing settings object or create a new one", async () => {
      mockedFindUser.mockResolvedValueOnce(mockedUserDoc);

      const response = await request(app).get("/settings").send();
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty("_id");
      expect(response.body.data).toHaveProperty("autoSave", false);
      expect(response.body.data).toHaveProperty("useGrayscaleIcons", false);
      expect(response.body.data).toHaveProperty("colorMode", "LIGHT");
    });
  });

  describe("POST /settings", () => {
    it("should update or create a settings object", async () => {
      mockedFindUser.mockResolvedValueOnce(mockedUserDoc);

      const body = {
        autoSave: true,
        useGrayscaleIcons: true,
        colorMode: "DARK",
      };

      const response = await request(app).patch("/settings").send(body);
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty("_id");
      expect(response.body.data).toHaveProperty("autoSave", true);
      expect(response.body.data).toHaveProperty("useGrayscaleIcons", true);
      expect(response.body.data).toHaveProperty("colorMode", "DARK");
    });
  });
});
