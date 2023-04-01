import mongoose from "mongoose";
import { Env } from "@constants/env";
import { InvocationType } from "@constants/invocation";
import { BaseDocument } from "@models/base.model";
import { FunctionDocument } from "./function.model";
import { FunctionVersionDocument } from "./functionVersion.model";

export interface InvocationInput {
  caller?: string; // the ID of whatever made this invocation (could be a plugin, another function etc.)
  env: Env;
  error?: any;
  function: FunctionDocument["_id"];
  input?: any; // we can store the "agnos" field of the function sandbox here
  meta?: any; // we can store the specific version of the calling plugin here
  output?: any; // store the value returned by the invoked function here
  type: InvocationType;
  version: FunctionVersionDocument["_id"];
}

export interface InvocationDocument extends BaseDocument, InvocationInput, mongoose.Document {
  expiresAt?: Date;
}

const invocationSchema = new mongoose.Schema(
  {
    caller: { type: String },
    env: { type: String, enum: Object.keys(Env), required: true },
    error: { type: {} },
    expiresAt: { type: Date },
    function: { type: mongoose.Schema.Types.ObjectId, ref: "Function" },
    input: { type: {} },
    meta: { type: {} },
    output: { type: {} },
    type: { type: String, enum: Object.keys(InvocationType), required: true },
    version: { type: String, ref: "FunctionVersion" },
  },
  {
    timestamps: true,
  }
);

// by default invocations are deleted when their "createdAt" expires
invocationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });
// but invocations created in test environments have an additional "expiresAt" field
// to get them deleted earlier
invocationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 });

const InvocationModel = mongoose.model<InvocationDocument>("Invocation", invocationSchema);

export default InvocationModel;
