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
import InstallationModel, { InstallationDocument } from "@models/installation";

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
  paidUpgrade?: boolean; // if true, the org needs to pay to upgrade from another version to this publication
  personal?: boolean;
  private?: boolean;
  picture?: string;
  scopes?: Array<PermissionScope>;
  supportedEnvLocations?: Array<string>;
  tags?: Array<string>;
  user: UserDocument["_id"];
  version: string;
}

export interface PublicationDocument extends BaseDocument, PublicationInput, mongoose.Document {
  installations?: Array<InstallationDocument["_id"]>;
  installationsCount?: bigint; // for each installation: { $inc: { installationsCount: 1 }}
}

const publicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    component: { type: mongoose.Schema.Types.ObjectId, ref: "Component" },
    description: { type: String },
    forms: [FormSchema],
    installations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Installation" }],
    installationsCount: { type: Number },
    licenses: [LicenseSchema],
    onEnvChanged: { type: String },
    onEnvDeployed: { type: String },
    onInit: { type: String },
    onModelChanged: { type: String },
    org: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
    paidUpgrade: { type: Boolean, default: false },
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

  InstallationModel.remove({ publication: publication._id })
    .exec()
    .catch((reason: unknown) => {
      logger.error("Error removing installations for publication", { reason, publication: publication._id });
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
 *        installations:
 *          type: array
 *          items:
 *            oneOf:
 *              - $ref: '#/components/schemas/Installation'
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
 *        paidUpgrade:
 *          type: boolean
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
