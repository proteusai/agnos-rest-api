import { connect, disconnect } from "@utils/connect";
import SettingsModel, { SettingsInput } from "@models/settings";
import mongoose from "mongoose";
import { ColorMode } from "@constants/settings";

describe("Settings Model", () => {
  beforeAll(async () => {
    await connect();
  });

  afterEach(async () => {
    await SettingsModel.deleteMany({});
  });

  afterAll(async () => {
    await SettingsModel.collection.drop();
    await disconnect();
  });

  it("should successfully create a settings document", async () => {
    const settingsInput: SettingsInput = {
      colorMode: ColorMode.dark,
      useGrayscaleIcons: true,
      user: new mongoose.Types.ObjectId(),
    };

    const settings = new SettingsModel(settingsInput);

    await expect(settings.save()).resolves.toBeDefined();
  });

  it("should not create 2 settings documents for a unique user", async () => {
    const userId = new mongoose.Types.ObjectId();

    const settingsInput1: SettingsInput = {
      colorMode: ColorMode.dark,
      useGrayscaleIcons: true,
      user: userId,
    };
    const settings1 = new SettingsModel(settingsInput1);

    const settingsInput2: SettingsInput = {
      colorMode: ColorMode.dark,
      useGrayscaleIcons: true,
      user: userId,
    };
    const settings2 = new SettingsModel(settingsInput2);

    await expect(settings1.save()).resolves.toBeDefined();
    // can't create 2 settings for the same user
    await expect(settings2.save()).rejects.toThrow();
  });
});
