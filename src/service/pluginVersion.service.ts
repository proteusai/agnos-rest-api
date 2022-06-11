import { FilterQuery, UpdateQuery, QueryOptions } from "mongoose";
import { ServiceOptions } from ".";
import PluginVersionModel, {
  PluginVersionDocument,
  PluginVersionInput,
} from "../models/pluginVersion.model";

const defaultPopulate = ["plugin", "team", "user"];

export async function createPluginVersion(input: PluginVersionInput) {
  const pluginVersion = await createPluginVersionDocument(input);

  return pluginVersion.toJSON();
}
export async function createPluginVersionDocument(input: PluginVersionInput) {
  const pluginVersion = await PluginVersionModel.create(input);

  return pluginVersion;
}

export async function findPluginVersion(
  query: FilterQuery<PluginVersionDocument>
) {
  return PluginVersionModel.findOne(query).lean();
}

export async function findPluginVersions(
  query: FilterQuery<PluginVersionDocument>,
  options?: ServiceOptions
) {
  return PluginVersionModel.find(query)
    .populate(options?.populate || defaultPopulate)
    .sort({ createdAt: -1 })
    .lean();
}

export async function findAndUpdatePluginVersion(
  query: FilterQuery<PluginVersionDocument>,
  update: UpdateQuery<PluginVersionDocument>,
  options: QueryOptions
) {
  return PluginVersionModel.findOneAndUpdate(query, update, options);
}
