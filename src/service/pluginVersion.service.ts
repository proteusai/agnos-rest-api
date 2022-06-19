import { FilterQuery, UpdateQuery, QueryOptions } from "mongoose";
import { ServiceOptions } from ".";
import { createMenu, Menu } from "../models/menu.model";
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
  const pluginVersion = await PluginVersionModel.create({
    ...input,
    menus: convertConfigToMenus(input._id, input.config),
  });

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
  return PluginVersionModel.findOneAndUpdate(
    query,
    {
      ...update,
      ...(update.config && {
        menus: convertConfigToMenus(query._id, update.config),
      }),
    },
    options
  );
}

function convertConfigToMenus(id: string, config: string): Array<Menu> {
  const menus: Array<Menu> = [];

  const jsonConfig = JSON.parse(config);
  if (jsonConfig.menus) {
    jsonConfig.menus.map((menu: Omit<Menu, "id">) =>
      menus.push(createMenu(id, menu))
    );
  }

  return menus;
}
