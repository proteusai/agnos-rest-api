import mongoose from "mongoose";
import { BaseDocument } from "@models/base";
import { UserDocument } from "@models/user";
import { ColorMode } from "@constants/settings";

export interface SettingsInput {
  autoSave?: boolean;
  colorMode?: ColorMode;
  useGrayscaleIcons?: boolean;
  user: UserDocument["_id"];
}

export interface SettingsDocument extends BaseDocument, SettingsInput, mongoose.Document {}

const settingsSchema = new mongoose.Schema(
  {
    autoSave: { type: Boolean, default: false },
    colorMode: { type: String, enum: Object.keys(ColorMode), default: ColorMode.LIGHT },
    useGrayscaleIcons: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

/**
 * @openapi
 * components:
 *  schemas:
 *    Settings:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        autoSave:
 *          type: boolean
 *        colorMode:
 *          type: string
 *          enum:
 *           - DARK
 *           - LIGHT
 *        useGrayscaleIcons:
 *          type: boolean
 *        user:
 *          oneOf:
 *            - $ref: '#/components/schemas/User'
 *            - type: string
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 */

const SettingsModel = mongoose.model<SettingsDocument>("Settings", settingsSchema);

export default SettingsModel;
