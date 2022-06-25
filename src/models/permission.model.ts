import mongoose from "mongoose";

export interface PermissionInput {
  name: string;
  description?: string;
  value: number;
}

export interface PermissionDocument extends PermissionInput, mongoose.Document {}

const permissionSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    description: { type: String },
    value: { type: Number, required: true },
  },
  { _id: false }
);

const PermissionModel = mongoose.model<PermissionDocument>("Permission", permissionSchema);

export default PermissionModel;
