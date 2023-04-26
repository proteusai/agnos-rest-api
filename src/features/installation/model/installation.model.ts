import mongoose from "mongoose";
import { BaseDocument } from "@models/base";
import { UserDocument } from "@models/user";
import logger from "@utils/logger";
import OrgModel, { OrgDocument } from "@models/org";
import PublicationModel, { PublicationDocument } from "@models/publication";

export interface InstallationInput {
  disabled?: boolean; // useful for deactivating an installation without uninstalling/deleting it
  licenseToken: string; // token representing the license for this installation
  org: OrgDocument["_id"]; // the buying org
  publication: PublicationDocument["_id"];
  user: UserDocument["_id"];
}

export interface InstallationDocument extends BaseDocument, InstallationInput, mongoose.Document {}

const installationSchema = new mongoose.Schema(
  {
    disabled: { type: Boolean, default: false },
    licenseToken: { type: String, required: true },
    org: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
    publication: { type: mongoose.Schema.Types.ObjectId, ref: "Publication", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

installationSchema.pre("remove", async function (next) {
  const installation = this as unknown as InstallationDocument;

  OrgModel.updateMany({ installations: installation._id }, { $pull: { installations: installation._id } })
    .exec()
    .catch((reason) => {
      logger.error("Error removing installations for org", { reason, org: installation.org });
    });

  PublicationModel.updateMany({ installations: installation._id }, { $pull: { installations: installation._id } })
    .exec()
    .catch((reason) => {
      logger.error("Error removing installations for publication", { reason, publication: installation.publication });
    });

  return next();
});

/**
 * @openapi
 * components:
 *  schemas:
 *    Installation:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        disabled:
 *          type: boolean
 *        licenseToken:
 *          type: string
 *        org:
 *          oneOf:
 *            - $ref: '#/components/schemas/Organization'
 *            - type: string
 *        publication:
 *          oneOf:
 *            - $ref: '#/components/schemas/Publication'
 *            - type: string
 *        user:
 *          oneOf:
 *            - $ref: '#/components/schemas/User'
 *            - type: string
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 */

const InstallationModel = mongoose.model<InstallationDocument>("Installation", installationSchema);

export default InstallationModel;
