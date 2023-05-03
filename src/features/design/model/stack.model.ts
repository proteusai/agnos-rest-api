import mongoose from "mongoose";
import { DEFAULT_ORG_PICTURE } from "@constants/defaults";
import { BaseDocument } from "@models/base";
import { UserDocument } from "@models/user";
import logger from "@utils/logger";
import OrgModel, { OrgDocument } from "@models/org";
import { PermissionScope } from "@constants/permissions";
import { ComponentDocument } from "@models/component";

export interface StackInput {
  name: string;
  description?: string;
  positions?: object; // Ui positions of the instances
}
