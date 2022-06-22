import { FilterQuery } from "mongoose";
import PermissionModel, { PermissionDocument, PermissionInput } from "../models/permission.model";

export async function createPermission(input: PermissionInput) {
  const permission = await PermissionModel.create(input);

  return permission.toJSON();
}

export async function findPermission(query: FilterQuery<PermissionDocument>) {
  return PermissionModel.findOne(query).lean();
}
