import mongoose from "mongoose";
import { DEFAULT_ORG_PICTURE } from "@constants/defaults";
import { BaseDocument } from "@models/base";
import { UserDocument } from "@models/user";
import logger from "@utils/logger";
import OrgModel, { OrgDocument } from "@models/org";
import { PermissionScope } from "@constants/permissions";
import { ComponentDocument } from "@models/component";

export interface EnvInput {
  name: string;
  description?: string;
  fs?: object; // { [key: string]: { [name: string]: { type: "file|folder", name, children } } }; // filesystem
  // location: string; local|aws|gcp|azure
  // os: string; linux|windows|mac
  // version: string; 1.0.0
  stack: string;
  type: "compose" | "aws"; //
  values?: object; // { [key: string]: { inputs, outputs } };
}
