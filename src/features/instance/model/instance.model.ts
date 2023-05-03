import mongoose from "mongoose";
import { DEFAULT_ORG_PICTURE } from "@constants/defaults";
import { BaseDocument } from "@models/base";
import { UserDocument } from "@models/user";
import logger from "@utils/logger";
import OrgModel, { OrgDocument } from "@models/org";
import { PermissionScope } from "@constants/permissions";
import { ComponentDocument } from "@models/component";

/*
The story:
- Instance form values are saved in the Instance model per environment
- Instances can write to their "outputs" per environment
- Instance can write to the env variables per environment
- Instance env, form and outputs variables can be accessed by code running in the instance
- Each instance has its own filesystem which is the same across all environments
 */

export interface InstanceInput {
  name: string;
  description?: string;
  models?: object; // array of models to listen to
  stack: string;
  // modelSubscriptions, fs, installation, publication, org, project, design
}
