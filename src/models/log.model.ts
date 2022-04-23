import mongoose from "mongoose";
import { Env } from "../constants/env";
import { LogType } from "../constants/log";
import { DataType } from "../constants/type";
import { BaseDocument } from "./base.model";

export interface LogInput {
  data: any;
  dataType?: DataType;
  env: Env;
  meta?: object;
  source: string;
  type?: LogType;
}

export interface LogDocument
  extends BaseDocument,
    LogInput,
    mongoose.Document {}

const logSchema = new mongoose.Schema(
  {
    data: { type: {}, required: true },
    dataType: {
      type: String,
      enum: Object.keys(DataType),
      default: DataType.STRING,
    },
    env: { type: String, enum: Object.keys(Env), required: true },
    meta: { type: {} },
    source: { type: String, required: true },
    type: { type: String, enum: Object.keys(LogType), default: LogType.INFO },
  },
  {
    timestamps: true,
  }
);

logSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 });

const LogModel = mongoose.model<LogDocument>("Log", logSchema);

export default LogModel;
