import mongoose from "mongoose";
import { DEFAULT_ORG_PICTURE } from "@constants/defaults";
import { BaseDocument } from "@models/base";
import { UserDocument } from "@models/user";
import logger from "@utils/logger";
import OrgModel, { OrgDocument } from "@models/org";
import CollaborationModel, { CollaborationDocument } from "@models/collaboration";

/*
The story:
- to register changes to models we need to create a ModelChangeEventSet (capped collection)
    - name: the name of the changeset; auto-generated
    - description: the description of the changeset; auto-generated
    - project: the project that the model belongs to
    - user: the user that created the changeset
    - before: snapshot of the models before the changeset
    - after: snapshot of the models after the changeset
    - events: the events that make up the changeset
        - type: create_model|update_model|delete_model|create_field|update_field|delete_field
        - model?: the model that was changed
        - field?: the field that was changed (if applicable)
        - value?: the value of the field (if applicable)
        - opposite?: the opposite event (if applicable)
- when a ModelChangeEventSet is created, it will trigger the onModelChanged events in the components
- Introduce ModelCanvas to store physical positions of models as well as orientation
 */

export interface ModelInput {
  name: string;
  description?: string;
  personal?: boolean;
  private?: boolean;
  picture?: string;
  secrets?: object;
  org: OrgDocument["_id"];
  user: UserDocument["_id"];
}

export interface ProjectDocument extends BaseDocument, ModelInput, mongoose.Document {
  collaborations?: Array<CollaborationDocument["_id"]>;
}

const projectSchema = new mongoose.Schema(
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

projectSchema.pre("remove", async function (next) {
  const project = this as unknown as ProjectDocument;

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

const ProjectModel = mongoose.model<ProjectDocument>("Project", projectSchema);

export default ProjectModel;
