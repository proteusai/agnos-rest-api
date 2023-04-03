import mongoose from "mongoose";
import { PermissionName } from "@constants/permissions";
import { BaseDocument } from "@models/base.model";
import DesignModel, { DesignDocument } from "./design.model";
import UserModel, { UserDocument } from "@models/user.model";

export interface UserDesignShareInput {
  design: DesignDocument["_id"];
  user: UserDocument["_id"];
  permission: PermissionName;
}

export interface UserDesignShareDocument extends BaseDocument, UserDesignShareInput, mongoose.Document {}

const userDesignShareSchema = new mongoose.Schema(
  {
    design: { type: mongoose.Schema.Types.ObjectId, ref: "Design" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    permission: { type: String, ref: "Permission" },
  },
  {
    timestamps: true,
  }
);

userDesignShareSchema.pre("remove", function (next) {
  const userDesignShare = this as unknown as UserDesignShareDocument;

  DesignModel.updateMany(
    { userDesignShares: userDesignShare._id },
    { $pull: { userDesignShares: userDesignShare._id } }
  )
    .exec()
    .catch(() => {
      // TODO: what do we do?
    });
  UserModel.updateMany({ userDesignShares: userDesignShare._id }, { $pull: { userDesignShares: userDesignShare._id } })
    .exec()
    .catch(() => {
      // TODO: what do we do?
    });

  next();
});

const UserDesignShareModel = mongoose.model<UserDesignShareDocument>("UserDesignShare", userDesignShareSchema);

export default UserDesignShareModel;
