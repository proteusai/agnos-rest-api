import { object, string, boolean, TypeOf } from "zod";

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

export const createTeamSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    description: string().optional(),
    email: string().email("Not a valid email").optional(),
    private: boolean().optional(),
    picture: string().optional(),
    secrets: object({}).optional(),
  }),
});

export type CreateTeamInput = Omit<
  TypeOf<typeof createTeamSchema>,
  "body.secrets"
>;
