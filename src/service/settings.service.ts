import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import SettingsModel, { SettingsDocument, SettingsInput } from "../models/settings.model";

export async function createSettings(input: SettingsInput) {
  const settings = await createSettingsDocument(input);

  return settings.toJSON();
}
export async function createSettingsDocument(input: SettingsInput) {
  try {
    const settings = await SettingsModel.create(input);

    return settings;
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function findOneSetOfSettings(query: FilterQuery<SettingsDocument>) {
  return SettingsModel.findOne(query).lean();
}

export async function findOneSetOfSettingsDocument(query: FilterQuery<SettingsDocument>) {
  return SettingsModel.findOne(query);
}

export async function findManySetsOfSettings(query: FilterQuery<SettingsDocument>) {
  return SettingsModel.find(query).lean();
}

export async function findAndUpdateSettings(
  query: FilterQuery<SettingsDocument>,
  update: UpdateQuery<SettingsDocument>,
  options: QueryOptions
) {
  return SettingsModel.findOneAndUpdate(query, update, options);
}
