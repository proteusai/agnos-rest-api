import { NAME_MISSING, ORG_ID_MISSING } from "@constants/errors";
import { object, string, boolean, TypeOf } from "zod";

const params = {
  params: object({
    id: string({
      required_error: ORG_ID_MISSING,
    }),
  }),
};

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateProjectRequestBody:
 *      type: object
 *      required:
 *        - name
 *      properties:
 *        name:
 *          type: string
 *          example: Test Org
 *        description:
 *          type: string
 *          example: A test organization
 *        org:
 *          type: string
 *          example: 125436678907543098765432
 *        private:
 *          type: boolean
 *          example: false
 *        picture:
 *          type: string
 *          example: https://content.com/image.png
 *        secrets:
 *          type: object
 *          additionalProperties: true
 *    CreateOrganizationResponse:
 *      type: object
 *      properties:
 *        data:
 *          $ref: '#/components/schemas/Organization'
 */
export const createProjectRequestSchema = object({
  body: object({
    name: string({
      required_error: NAME_MISSING,
    }),
    description: string().optional(),
    org: string().optional(), // if missing, create the project under the user's personal org (and set project.personal to true)
    private: boolean().optional(),
    picture: string().optional(),
    secrets: object({}).optional(),
  }),
});

/**
 * @openapi
 * components:
 *  schemas:
 *    GetProjectResponse:
 *      type: object
 *      properties:
 *        data:
 *          $ref: '#/components/schemas/Project'
 *    GetProjectsResponse:
 *      type: object
 *      properties:
 *        data:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Project'
 */
export const getProjectRequestSchema = object({
  ...params,
});

export type CreateProjectRequest = TypeOf<typeof createProjectRequestSchema>;
export type GetProjectRequest = TypeOf<typeof getProjectRequestSchema>;
