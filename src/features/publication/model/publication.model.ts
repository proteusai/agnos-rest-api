import mongoose from "mongoose";
import { DEFAULT_ORG_PICTURE } from "@constants/defaults";
import { BaseDocument } from "@models/base";
import { UserDocument } from "@models/user";
import logger from "@utils/logger";
import OrgModel, { OrgDocument } from "@models/org";
import { PermissionScope } from "@constants/permissions";
import { ResourceDocument } from "@models/resource";

export interface PublicationInput {
  name: string;
  description?: string;
  docker?: string;
  onInit?: string;
  onModelCreated?: string;
  onModelDeleted?: string;
  onModelUpdated?: string;
  onRefresh?: string;
  org: OrgDocument["_id"];
  personal?: boolean;
  private?: boolean;
  picture?: string;
  resource: ResourceDocument["_id"];
  scopes?: Array<PermissionScope>;
  serviceDefinition?: string;
  tags?: Array<string>;
  user: UserDocument["_id"];
  version: string;
}

export interface PublicationDocument extends BaseDocument, PublicationInput, mongoose.Document {}

const publicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    personal: { type: Boolean, default: false },
    private: { type: Boolean, default: false },
    picture: { type: String, default: DEFAULT_ORG_PICTURE },
    secrets: { type: {} },
    org: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

publicationSchema.pre("remove", async function (next) {
  const project = this as unknown as PublicationDocument;

  OrgModel.updateMany({ projects: project._id }, { $pull: { projects: project._id } })
    .exec()
    .catch((reason) => {
      logger.error("Error removing projects for org", { reason, org: project.org });
    });

  return next();
});

/**
 * @openapi
 * components:
 *  schemas:
 *    Project:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        name:
 *          type: string
 *        collaborations:
 *          type: array
 *          items:
 *            oneOf:
 *              - $ref: '#/components/schemas/Collaboration'
 *              - type: string
 *        description:
 *          type: string
 *        org:
 *          oneOf:
 *            - $ref: '#/components/schemas/Organization'
 *            - type: string
 *        personal:
 *          type: boolean
 *        picture:
 *          type: string
 *        private:
 *          type: boolean
 *        secrets:
 *          type: object
 *          additionalProperties: true
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

const ResourceModel = mongoose.model<PublicationDocument>("Resource", publicationSchema);

export default ResourceModel;
