import mongoose from "mongoose";
import { DEFAULT_COMPONENT_PICTURE } from "@constants/defaults";
import { BaseDocument } from "@models/base";
import { UserDocument } from "@models/user";
import logger from "@utils/logger";
import OrgModel, { OrgDocument } from "@models/org";
import CollaborationModel, { CollaborationDocument } from "@models/collaboration";
import { PermissionScope } from "@constants/permissions";
import { Form, FormSchema } from "@models/form";
import PublicationModel, { PublicationDocument } from "@models/publication";

/*
The story:
- user creates a Component (in an org or personal)
- user can publish the component to the marketplace (as a Publication)
- user can install a published component (a Publication) into an org as an Installation
- user can add an Instance of a Publication (into a Design); to do that the org must have an Installation of the Publication
 */

export interface ComponentInput {
  name: string;
  description?: string;
  forms?: Array<Form>; // "inputs" will be derived from this and env.values
  onEnvChanged?: string; // code to run when env is created/updated/deleted
  onEnvDeployed?: string; // code to run when env is deployed
  onInit?: string; // code to run when component is initialized
  onModelChanged?: string; // code to run when model is created/updated/deleted
  org: OrgDocument["_id"];
  personal?: boolean;
  private?: boolean;
  picture?: string;
  scopes?: Array<PermissionScope>;
  supportedEnvLocations?: Array<string>; // e.g. ["aws", "gcp/ubuntu", "azure/windows@10", "local/mac"]
  tags?: Array<string>;
  user: UserDocument["_id"];
  version: string;
}

export interface ComponentDocument extends BaseDocument, ComponentInput, mongoose.Document {
  collaborations?: Array<CollaborationDocument["_id"]>;
  publications?: Array<PublicationDocument["_id"]>;
}

const componentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    collaborations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collaboration" }],
    description: { type: String },
    forms: [FormSchema],
    onEnvChanged: { type: String },
    onEnvDeployed: { type: String },
    onInit: { type: String },
    onModelChanged: { type: String },
    org: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
    personal: { type: Boolean, default: false },
    picture: { type: String, default: DEFAULT_COMPONENT_PICTURE },
    private: { type: Boolean, default: false },
    publications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Publication" }],
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

componentSchema.pre("remove", async function (next) {
  const component = this as unknown as ComponentDocument;

  CollaborationModel.remove({ component: component._id })
    .exec()
    .catch((reason: unknown) => {
      logger.error("Error removing collaborations for component", { reason, component: component._id });
    });

  OrgModel.updateMany({ components: component._id }, { $pull: { components: component._id } })
    .exec()
    .catch((reason) => {
      logger.error("Error removing components for org", { reason, org: component.org });
    });

  PublicationModel.remove({ component: component._id })
    .exec()
    .catch((reason: unknown) => {
      logger.error("Error removing publications for component", { reason, component: component._id });
    });

  return next();
});

/**
 * @openapi
 * components:
 *  schemas:
 *    Component:
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
 *        forms:
 *          type: array
 *          items:
 *            oneOf:
 *              - $ref: '#/components/schemas/Form'
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
 *        publications:
 *          type: array
 *          items:
 *            oneOf:
 *              - $ref: '#/components/schemas/Publication'
 *              - type: string
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

const ComponentModel = mongoose.model<ComponentDocument>("Component", componentSchema);

export default ComponentModel;
