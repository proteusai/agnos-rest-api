import mongoose from "mongoose";
import { BaseDocument } from "./base.model";
import { UserDocument } from "./user.model";

export interface SettingsInput {
  autoSave?: boolean;
  useGrayscaleIcons?: boolean;
  user: UserDocument["_id"];
}

export interface SettingsDocument
  extends BaseDocument,
    SettingsInput,
    mongoose.Document {}

const settingsSchema = new mongoose.Schema(
  {
    autoSave: { type: Boolean, default: false },
    useGrayscaleIcons: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const SettingsModel = mongoose.model<SettingsDocument>(
  "Settings",
  settingsSchema
);

export default SettingsModel;
