import mongoose from "mongoose";
import { DEFAULT_ORG_PICTURE } from "@constants/defaults";
import { BaseDocument } from "@models/base";
import { UserDocument } from "@models/user";
import logger from "@utils/logger";
import OrgModel, { OrgDocument } from "@models/org";
import CollaborationModel, { CollaborationDocument } from "@models/collaboration";
import { PermissionScope } from "@constants/permissions";

export interface ResourceInput {
  name: string;
  description?: string;
  docker?: string; // url to or content of docker file
  // image?: string; // docker image
  onInit?: string; // code to run when resource is initialized
  onModelCreated?: string; // code to run when model is created
  onModelDeleted?: string; // code to run when model is deleted
  onModelUpdated?: string; // code to run when model is updated
  org: OrgDocument["_id"];
  personal?: boolean;
  precursor?: ResourceDocument["_id"];
  private?: boolean;
  picture?: string;
  published?: boolean; // used to indicate that the resource is in the marketplace and cannot be edited/re-published
  // purchased?: boolean; // used to indicate that the resource was purchased; this is NOT good cuz it becomes hard to count the number of installations
  scopes?: Array<PermissionScope>;
  secrets?: object;
  serviceDefinition?: string; // the docker-compose service definition (without some stuff like "depends_on")
  successor?: ResourceDocument["_id"];
  tags?: Array<string>;
  user: UserDocument["_id"];
  version: string;
  versionFamily: string; // used to indicate that the resource is a version of another resource; precursor.versionFamily OR auto-generated
}

// create publishedResource and installedResource and instance (will have inputs and outputs and models they subscribe to) models

export interface ResourceDocument extends BaseDocument, ResourceInput, mongoose.Document {
  collaborations?: Array<CollaborationDocument["_id"]>;
}

const resourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    collaborations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collaboration" }],
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

resourceSchema.pre("remove", async function (next) {
  const project = this as unknown as ResourceDocument;

  CollaborationModel.remove({ project: project._id })
    .exec()
    .catch((reason: unknown) => {
      logger.error("Error removing collaborations for project", { reason, project: project._id });
    });
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

const ResourceModel = mongoose.model<ResourceDocument>("Project", resourceSchema);

export default ResourceModel;
