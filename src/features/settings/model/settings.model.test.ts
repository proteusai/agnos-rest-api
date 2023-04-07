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
      colorMode: ColorMode.DARK,
      useGrayscaleIcons: true,
      user: new mongoose.Types.ObjectId(),
    };

    const settings = new SettingsModel(settingsInput);

    await expect(settings.save()).resolves.toBeDefined();
  });
});
