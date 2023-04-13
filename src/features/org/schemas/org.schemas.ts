import { EMAIL_INVALID, NAME_MISSING, ORG_ID_MISSING } from "@constants/errors";
import { object, string, boolean, TypeOf } from "zod";

const params = {
  params: object({
    id: string({
      required_error: ORG_ID_MISSING,
    }),
  }),
};

const query = {
  query: object({
    populate: string().optional(),
  }),
};

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateTeamInput:
 *      type: object
 *      required:
 *        - name
 *      properties:
 *        name:
 *          type: string
 *          default: Team A
 *        email:
 *          type: string
 *          default: team.a@example.com
 *        private:
 *          type: boolean
 *          default: false
 *        picture:
 *          type: string
 *          default: https://content.com/image.png
 *        secrets:
 *          type: object
 *          additionalProperties:
 *             type: string
 *    CreateTeamResponse:
 *      type: object
 *      properties:
 *        team:
 *          type: object
 *          properties:
 *            _id:
 *              type: string
 *            name:
 *              type: string
 *            email:
 *              type: string
 *            private:
 *              type: boolean
 *            picture:
 *              type: string
 *            userId:
 *              type: string
 *            createdAt:
 *              type: string
 *            updatedAt:
 *              type: string
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

export const getOrgRequestSchema = object({
  ...params,
  ...query,
});

export const getOrgsRequestSchema = object({
  ...query,
});

export type CreateOrgRequest = TypeOf<typeof createOrgRequestSchema>;
export type GetOrgRequest = TypeOf<typeof getOrgRequestSchema>;
export type GetOrgsRequest = TypeOf<typeof getOrgsRequestSchema>;
