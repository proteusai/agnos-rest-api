import mongoose from "mongoose";
import { BaseDocument } from "./base.model";
import { Menu, MenuSchema } from "./menu.model";
import PluginModel, { PluginDocument } from "./plugin.model";
import { TeamDocument } from "./team.model";
import { UserDocument } from "./user.model";

export interface PluginVersionInput {
  name: string;
  config: string;
  description?: string;
  published: boolean; // version cannot be edited once published
  plugin: PluginDocument["_id"];
  team: TeamDocument["_id"]; // ref to the team that created this plugin version
  user: UserDocument["_id"]; // ref to the user that created this plugin version
}

export interface PluginVersionDocument
  extends BaseDocument,
    PluginVersionInput,
    mongoose.Document {
  menus?: Array<Menu>;
}

const pluginVersionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    config: { type: String, required: true },
    description: { type: String },
    menus: { type: [MenuSchema] },
    published: { type: Boolean, default: false },
    plugin: { type: mongoose.Schema.Types.ObjectId, ref: "Plugin" },
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

pluginVersionSchema.pre("remove", async function (next) {
  let version = this as PluginVersionDocument;

  PluginModel.updateMany(
    { versions: version._id },
    { $pull: { versions: version._id } }
  ).exec();

  return next();
});

const PluginVersionModel = mongoose.model<PluginVersionDocument>(
  "PluginVersion",
  pluginVersionSchema
);

export default PluginVersionModel;
