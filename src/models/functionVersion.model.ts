import mongoose from "mongoose";
import { BaseDocument } from "./base.model";
import FunctionModel, { FunctionDocument } from "./function.model";
import { TeamDocument } from "./team.model";
import { UserDocument } from "./user.model";

export interface FunctionVersionInput {
  _id: string;
  name: string;
  code: string;
  description?: string;
  function: FunctionDocument["_id"];
  published?: boolean; // version cannot be edited once published
  secrets?: object;
  team: TeamDocument["_id"]; // ref to the team that created this function version
  user: UserDocument["_id"]; // ref to the user that created this function version
}

export interface FunctionVersionDocument
  extends BaseDocument,
    Omit<FunctionVersionInput, "_id">,
    mongoose.Document {}

const functionVersionSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
    description: { type: String },
    function: { type: mongoose.Schema.Types.ObjectId, ref: "Function" },
    published: { type: Boolean, default: false },
    secrets: { type: {} },
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    _id: false,
    timestamps: true,
  }
);

functionVersionSchema.pre("remove", async function (next) {
  let version = this as FunctionVersionDocument;

  FunctionModel.updateMany(
    { versions: version._id },
    { $pull: { versions: version._id } }
  ).exec();

  return next();
});

const FunctionVersionModel = mongoose.model<FunctionVersionDocument>(
  "FunctionVersion",
  functionVersionSchema
);

export default FunctionVersionModel;