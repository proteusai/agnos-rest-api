import mongoose from "mongoose";
import { DEFAULT_DESIGN_PICTURE } from "../constants/defaults";
import { BaseDocument } from "./base.model";
import TeamModel, { TeamDocument } from "./team.model";
import TeamDesignShareModel, { TeamDesignShareDocument } from "./teamDesignShare.model";
import { UserDocument } from "./user.model";
import UserDesignShareModel, { UserDesignShareDocument } from "./userDesignShare.model";

export interface DesignInput {
  name: string;
  description?: string;
  flow?: object;
  private?: boolean;
  picture?: string;
  secrets?: object;
  template?: boolean; // if true the design appears in the templates page
  team: TeamDocument["_id"]; // ref to the team that created this design
  user: UserDocument["_id"]; // ref to the user that created this design
}

export interface DesignDocument extends BaseDocument, DesignInput, mongoose.Document {
  teamDesignShares?: Array<TeamDesignShareDocument["_id"]>;
  userDesignShares?: Array<UserDesignShareDocument["_id"]>;
}

const designSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    flow: { type: {} },
    private: { type: Boolean, default: false },
    picture: { type: String, default: DEFAULT_DESIGN_PICTURE },
    secrets: { type: {} },
    template: { type: Boolean, default: false },
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    teamDesignShares: [{ type: mongoose.Schema.Types.ObjectId, ref: "TeamDesignShare" }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userDesignShares: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserDesignShare" }],
  },
  {
    timestamps: true,
  }
);

designSchema.pre("remove", async function (next) {
  const design = this as DesignDocument;

  TeamModel.updateMany({ designs: design._id }, { $pull: { designs: design._id } })
    .exec()
    .catch(() => {
      // TODO: what do we do?
    });
  TeamDesignShareModel.remove({ design: design._id })
    .exec()
    .catch(() => {
      // TODO: what do we do?
    });
  UserDesignShareModel.remove({ design: design._id })
    .exec()
    .catch(() => {
      // TODO: what do we do?
    });

  return next();
});

const DesignModel = mongoose.model<DesignDocument>("Design", designSchema);

export default DesignModel;

// const designSchema = new mongoose.Schema(
//   {
//     name: String,
//     flow: { type: {} },
//     environments: [
//       {
//         name: { type: String, required: true },
//         provisions: [
//           {
//             componentId: { id: { type: String, required: true } },
//             service: {
//               type: {
//               },
//               required: true,
//             },
//             variables: []
//           },
//         ],
//       secrets: {},
//       },
//     ],
//     secrets: {},
//   },
//   {
//     timestamps: true,
//   }
// );
