import { FilterQuery, FlattenMaps, LeanDocument, QueryOptions, Types, UpdateQuery } from "mongoose";
import SettingsModel, { SettingsDocument, SettingsInput } from "@models/settings";

export async function createSettings(input: SettingsInput) {
  const settings = await SettingsModel.create(input);

  return settings.toJSON() as FlattenMaps<
    LeanDocument<
      SettingsDocument & {
        _id: Types.ObjectId;
      }
    >
  >;
}

export async function createSettingsDocument(input: SettingsInput) {
  const settings = await SettingsModel.create(input);

  return settings;
}

export async function findSettings(query: FilterQuery<SettingsDocument>) {
  return SettingsModel.findOne(query).lean();
}

export async function findAndUpdateSettings(
  query: FilterQuery<SettingsDocument>,
  update: UpdateQuery<SettingsDocument>,
  options: QueryOptions
) {
  return SettingsModel.findOneAndUpdate(query, update, options);
}

export async function updateSettings(query: FilterQuery<SettingsDocument>, update: UpdateQuery<SettingsDocument>) {
  return SettingsModel.updateOne(query, update);
}
