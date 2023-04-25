import mongoose from "mongoose";
import { DEFAULT_COMPONENT_PICTURE } from "@constants/defaults";
import { BaseDocument } from "@models/base";
import { UserDocument } from "@models/user";
import logger from "@utils/logger";
import OrgModel, { OrgDocument } from "@models/org";
import { PermissionScope } from "@constants/permissions";
import ComponentModel, { ComponentDocument } from "@models/component";
import { Form, FormSchema } from "@models/form";
import { License, LicenseSchema } from "@models/license";

export interface PublicationInput {
  name: string;
  component: ComponentDocument["_id"];
  description?: string;
  forms?: Array<Form>;
  licenses?: Array<License>; // can still be change after the publication is created
  onEnvChanged?: string;
  onEnvDeployed?: string;
  onInit?: string;
  onModelChanged?: string;
  org: OrgDocument["_id"];
  personal?: boolean;
  private?: boolean;
  picture?: string;
  scopes?: Array<PermissionScope>;
  supportedEnvLocations?: Array<string>;
  tags?: Array<string>;
  user: UserDocument["_id"];
  version: string;
}

export interface PublicationDocument extends BaseDocument, PublicationInput, mongoose.Document {}

const publicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    component: { type: mongoose.Schema.Types.ObjectId, ref: "Component" },
    description: { type: String },
    forms: [FormSchema],
    licenses: [LicenseSchema],
    onEnvChanged: { type: String },
    onEnvDeployed: { type: String },
    onInit: { type: String },
    onModelChanged: { type: String },
    org: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
    personal: { type: Boolean, default: false },
    picture: { type: String, default: DEFAULT_COMPONENT_PICTURE },
    private: { type: Boolean, default: false },
    scopes: [{ type: String, enum: Object.keys(PermissionScope) }],
    supportedEnvLocations: [{ type: String }],
    tags: [{ type: String }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    version: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

publicationSchema.pre("remove", async function (next) {
  const publication = this as unknown as PublicationDocument;

  ComponentModel.updateMany({ publications: publication._id }, { $pull: { publications: publication._id } })
    .exec()
    .catch((reason) => {
      logger.error("Error removing publications for component", { reason, component: publication.component });
    });

  OrgModel.updateMany({ publications: publication._id }, { $pull: { publications: publication._id } })
    .exec()
    .catch((reason) => {
      logger.error("Error removing publications for org", { reason, org: publication.org });
    });

  return next();
});

/**
 * @openapi
 * components:
 *  schemas:
 *    Publication:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        name:
 *          type: string
 *        component:
 *          oneOf:
 *            - $ref: '#/components/schemas/Component'
 *            - type: string
 *        description:
 *          type: string
 *        forms:
 *          type: array
 *          items:
 *            oneOf:
 *              - $ref: '#/components/schemas/Form'
 *              - type: string
 *        licenses:
 *          type: array
 *          items:
 *            oneOf:
 *              - $ref: '#/components/schemas/License'
 *              - type: string
 *        onEnvChanged:
 *          type: string
 *        onEnvDeployed:
 *          type: string
 *        onInit:
 *          type: string
 *        onModelChanged:
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
 *        scopes:
 *          type: array
 *          items:
 *            type: string
 *            enum:
 *              - read:design
 *              - read:environment
 *              - read:org
 *              - read:project
 *              - read:user
 *        supportedEnvLocations:
 *          type: array
 *          items:
 *            type: string
 *        tags:
 *          type: array
 *          items:
 *            type: string
 *        user:
 *          oneOf:
 *            - $ref: '#/components/schemas/User'
 *            - type: string
 *        version:
 *          type: string
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 */

const PublicationModel = mongoose.model<PublicationDocument>("Publication", publicationSchema);

export default PublicationModel;
