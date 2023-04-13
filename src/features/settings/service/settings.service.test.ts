import { FilterQuery, UpdateQuery } from "mongoose";
import SettingsModel, { SettingsDocument, SettingsInput } from "@models/settings";
import { connect, disconnect } from "@utils/connect";
import { createSettings, findSettings, updateSettings } from "@services/settings";

describe("Settings service", () => {
  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await SettingsModel.collection.drop();
    await disconnect();
  });

  describe("createSettings", () => {
    it("should create settings", async () => {
      const input: SettingsInput = {
        user: "5f9f1c5b9b9b9b9b9b9b9b9b",
        autoSave: true,
      };
      const settings = await createSettings(input);
      expect(settings).toBeDefined();
      expect(settings._id).toBeDefined();
      expect(String(settings.user)).toBe(String(input.user));
      expect(String(settings.autoSave)).toBe(String(input.autoSave));
    });
  });

  describe("findSettings", () => {
    it("should find settings by query", async () => {
      const input: SettingsInput = {
        user: "5f9f1c5b9b9b9b9b9b9b9b9c",
        autoSave: true,
      };
      const settings = await createSettings(input);
      const query: FilterQuery<SettingsDocument> = {
        _id: settings._id,
      };
      const foundSettings = await findSettings(query);
      expect(foundSettings).toBeDefined();
      expect(String(foundSettings?.user)).toBe(String(settings.user));
      expect(String(foundSettings?.autoSave)).toBe(String(settings.autoSave));
    });
  });

  describe("updateSettings", () => {
    it("should update a settings by query", async () => {
      const input: SettingsInput = {
        user: "5f9f1c5b9b9b9b9b9b9b9b9d",
        autoSave: true,
      };
      const query: FilterQuery<SettingsDocument> = {
        user: "5f9f1c5b9b9b9b9b9b9b9b9d",
      };
      const update: UpdateQuery<SettingsDocument> = {
        autoSave: true,
        useGrayscaleIcons: true,
      };
      await createSettings(input);
      const result = await updateSettings(query, update);
      expect(result).toBeDefined();
      expect(result.modifiedCount).toBe(1);
      const foundSettings = await findSettings(query);
      expect(foundSettings?.autoSave).toBe(true);
      expect(foundSettings?.useGrayscaleIcons).toBe(true);
    });
  });
});
