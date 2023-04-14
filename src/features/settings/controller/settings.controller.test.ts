import { Request, Response } from "express";
import { getSettingsHandler, updateSettingsHandler } from "@controllers/settings";
import { findAndUpdateSettings, findSettings } from "@services/settings";
import { findUserDocument } from "@services/user";
import { mockMongooseDocument } from "@mocks/mongoose";
import mongoose from "mongoose";

jest.mock("@services/user");
jest.mock("@services/settings");

const mockedFindUser = findUserDocument as jest.MockedFunction<typeof findUserDocument>;
const mockedFindSettings = findSettings as jest.MockedFunction<typeof findSettings>;
const mockedFindAndUpdateSession = findAndUpdateSettings as jest.MockedFunction<typeof findAndUpdateSettings>;

describe("Settings controller", () => {
  const req = {} as Request;
  let res = { send: jest.fn() } as unknown as Response;
  const mockedSettings = {
    _id: new mongoose.Types.ObjectId(),
    user: "user-id",
    autoSave: true,
    useGrayscaleIcons: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockedFindUser.mockClear();
    mockedFindSettings.mockClear();
    mockedFindAndUpdateSession.mockClear();
    res = { send: jest.fn(), status: jest.fn().mockReturnThis() } as unknown as Response;
  });

  describe("getSettingsHandler", () => {
    test("returns user settings", async () => {
      mockedFindSettings.mockResolvedValueOnce(mockedSettings);

      res.locals = { user: { _id: "user-id" } };

      await getSettingsHandler(req, res);

      expect(mockedFindSettings).toHaveBeenCalledTimes(1);
      expect(mockedFindSettings).toHaveBeenCalledWith({ user: "user-id" });
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith({ data: mockedSettings });
    });
  });

  describe("updateSettingsHandler", () => {
    test("updates settings and returns it", async () => {
      mockedFindSettings.mockResolvedValueOnce(mockedSettings);
      mockedFindAndUpdateSession.mockResolvedValueOnce({ ...mockedSettings, ...mockMongooseDocument });

      res.locals = { user: { _id: "user-id" } };

      await updateSettingsHandler(req, res);

      expect(mockedFindSettings).toHaveBeenCalledTimes(1);
      expect(mockedFindSettings).toHaveBeenCalledWith({ user: "user-id" });
      expect(mockedFindAndUpdateSession).toHaveBeenCalledTimes(1);
      expect(mockedFindAndUpdateSession).toHaveBeenCalledWith({ user: "user-id" }, req.body, { new: true });
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith({
        data: expect.objectContaining({ ...mockedSettings }),
      });
    });
  });
});
