import mongoose from "mongoose";
import { BaseDocument } from "@models/base";
import { UserDocument } from "@models/user";
import { ColorMode } from "@constants/settings";
import { OrgDocument } from "@models/org";

export interface SettingsInput {
  autoSave?: boolean;
  colorMode?: ColorMode;
  org?: OrgDocument["_id"];
  useGrayscaleIcons?: boolean;
  user?: UserDocument["_id"];
}

export interface SettingsDocument extends BaseDocument, SettingsInput, mongoose.Document {}

const settingsSchema = new mongoose.Schema(
  {
    autoSave: { type: Boolean, default: false },
    colorMode: { type: String, enum: Object.keys(ColorMode), default: ColorMode.light },
    org: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" },
    useGrayscaleIcons: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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
 *           - dark
 *           - light
 *        org:
 *          oneOf:
 *            - $ref: '#/components/schemas/Organization'
 *            - type: string
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
