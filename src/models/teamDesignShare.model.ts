import mongoose from "mongoose";
import { PermissionName } from "@constants/permissions";
import { BaseDocument } from "@models/base.model";
import DesignModel, { DesignDocument } from "./design.model";
import TeamModel, { TeamDocument } from "./team.model";

export interface TeamDesignShareInput {
  design: DesignDocument["_id"];
  team: TeamDocument["_id"];
  permission: PermissionName;
}

export interface TeamDesignShareDocument extends BaseDocument, TeamDesignShareInput, mongoose.Document {}

const teamDesignShareSchema = new mongoose.Schema(
  {
    design: { type: mongoose.Schema.Types.ObjectId, ref: "Design" },
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    permission: { type: String, ref: "Permission" },
  },
  {
    timestamps: true,
  }
);

teamDesignShareSchema.pre("remove", function (next) {
  const teamDesignShare = this as unknown as TeamDesignShareDocument;

  DesignModel.updateMany(
    { teamDesignShares: teamDesignShare._id },
    { $pull: { teamDesignShares: teamDesignShare._id } }
  )
    .exec()
    .catch(() => {
      // TODO: what do we do?
    });
  TeamModel.updateMany({ teamDesignShares: teamDesignShare._id }, { $pull: { teamDesignShares: teamDesignShare._id } })
    .exec()
    .catch(() => {
      // TODO: what do we do?
    });

  next();
});

const TeamDesignShareModel = mongoose.model<TeamDesignShareDocument>("TeamDesignShare", teamDesignShareSchema);

export default TeamDesignShareModel;
