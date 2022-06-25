import mongoose from "mongoose";
import { DEFAULT_PLUGIN_PICTURE } from "../constants/defaults";
import { BaseDocument } from "./base.model";
import PluginVersionModel, { PluginVersionDocument } from "./pluginVersion.model";
import TeamModel, { TeamDocument } from "./team.model";
import { UserDocument } from "./user.model";

export interface PluginInput {
  name: string;
  description?: string;
  picture?: string;
  private?: boolean;
  team: TeamDocument["_id"]; // ref to the team that created this plugin
  user: UserDocument["_id"]; // ref to the user that created this plugin
}

export interface PluginDocument extends BaseDocument, PluginInput, mongoose.Document {
  versions?: Array<PluginVersionDocument["_id"]>;
}

const pluginSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    picture: { type: String, default: DEFAULT_PLUGIN_PICTURE },
    private: { type: Boolean, default: false },
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    versions: [{ type: String, ref: "PluginVersion" }],
  },
  {
    timestamps: true,
  }
);

pluginSchema.pre("remove", async function (next) {
  const plugin = this as PluginDocument;

  TeamModel.updateMany({ plugins: plugin._id }, { $pull: { plugins: plugin._id } })
    .exec()
    .catch(() => {
      // TODO: what do we do?
    });
  PluginVersionModel.remove({ plugin: plugin._id })
    .exec()
    .catch(() => {
      // TODO: what do we do?
    });

  return next();
});

const PluginModel = mongoose.model<PluginDocument>("Plugin", pluginSchema);

export default PluginModel;
