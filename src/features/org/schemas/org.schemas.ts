import { EMAIL_INVALID, NAME_MISSING, ORG_ID_MISSING } from "@constants/errors";
import { object, string, boolean, TypeOf } from "zod";

const params = {
  params: object({
    org: string({
      required_error: ORG_ID_MISSING,
    }),
  }),
};

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateOrganizationRequestBody:
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
 *        email:
 *          type: string
 *          example: test.org@example.com
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
export const createOrgRequestSchema = object({
  body: object({
    name: string({
      required_error: NAME_MISSING,
    }),
    description: string().optional(),
    email: string().email(EMAIL_INVALID).optional(),
    private: boolean().optional(),
    picture: string().optional(),
    secrets: object({}).optional(),
  }),
});

/**
 * @openapi
 * components:
 *  schemas:
 *    GetOrganizationResponse:
 *      type: object
 *      properties:
 *        data:
 *          $ref: '#/components/schemas/Organization'
 *    GetOrganizationsResponse:
 *      type: object
 *      properties:
 *        data:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Organization'
 */
export const getOrgRequestSchema = object({
  ...params,
});

export type CreateOrgRequest = TypeOf<typeof createOrgRequestSchema>;
export type GetOrgRequest = TypeOf<typeof getOrgRequestSchema>;
