import { FilterQuery } from "mongoose";
import { ServiceOptions } from ".";
import PluginModel, { PluginDocument, PluginInput } from "../models/plugin.model";

const defaultPopulate = ["versions"];

export async function createPlugin(input: PluginInput) {
  const plugin = await createPluginDocument(input);

  return plugin.toJSON();
}
export async function createPluginDocument(input: PluginInput) {
  const plugin = await PluginModel.create(input);

  return plugin;
}

export async function findPlugin(query: FilterQuery<PluginDocument>) {
  return PluginModel.findOne(query).lean();
}

export async function findPluginDocument(query: FilterQuery<PluginDocument>) {
  return PluginModel.findOne(query);
}

export async function findPlugins(query: FilterQuery<PluginDocument>, options?: ServiceOptions) {
  return PluginModel.find(query)
    .populate(options?.populate || defaultPopulate)
    .lean();
}
