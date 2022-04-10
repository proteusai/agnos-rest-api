import mongoose from "mongoose";
import { DEFAULT_SERVICE_PICTURE } from "../constants/defaults";
import { BaseDocument } from "./base.model";
import { TeamDocument } from "./team.model";

export interface ServiceInput {
  name: string;
  version: string;
  config: string;
  description?: string;
  picture?: string;
  secrets?: object;
  team: TeamDocument["_id"];
}

export interface ServiceDocument
  extends BaseDocument,
    ServiceInput,
    mongoose.Document {
  data?: object;
  handler: string;
  headers?: object;
  method: string;
  published: boolean; // once you publish a service you can't edit it; you'll need to create another version
  variables?: Record<
    string,
    {
      label: string;
      type: string;
      default?: any;
      required?: boolean;
    }
  >;
}

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    version: { type: String, required: true },
    config: { type: String, required: true },
    data: { type: {} },
    description: { type: String },
    handler: { type: String, required: true },
    headers: { type: {} },
    method: { type: String, default: "POST" },
    published: { type: Boolean, default: false },
    picture: { type: String, default: DEFAULT_SERVICE_PICTURE },
    secrets: { type: {} },
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    variables: {
      type: mongoose.Schema.Types.Map,
      of: new mongoose.Schema({
        label: { type: String, required: true },
        type: { type: String, required: true },
        default: { type: {} },
        required: { type: Boolean },
      }),
    },
  },
  {
    timestamps: true,
  }
);

const ServiceModel = mongoose.model<ServiceDocument>("Service", serviceSchema);

export default ServiceModel;

/**
 * {component.text}
 * {secrets.abc}
 * {xyz}
 */
