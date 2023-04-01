import { object, string, TypeOf } from "zod";

/**
 * @openapi
 * components:
 *  schemas:
 *    Session:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        user:
 *          oneOf:
 *            - $ref: '#/components/schemas/User'
 *            - type: string
 *        email:
 *          type: string
 *        accessToken:
 *          type: string
 *        valid:
 *          type: boolean
 *        userAgent:
 *          type: string
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 *    CreateSessionRequestBody:
 *      type: object
 *      required:
 *        - email
 *        - accessToken
 *        - idToken
 *      properties:
 *        email:
 *          type: string
 *          example: jane.doe@example.com
 *        accessToken:
 *          type: string
 *          example: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 *        idToken:
 *          type: string
 *          example: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 *    CreateSessionResponse:
 *      type: object
 *      properties:
 *        data:
 *          $ref: '#/components/schemas/Session'
 *    GetSessionsResponse:
 *      type: object
 *      properties:
 *        data:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Session'
 */
export const createSessionSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
    accessToken: string({
      required_error: "Access token is required",
    }),
    idToken: string({
      required_error: "ID token is required",
    }),
  }),
});

export type CreateSessionRequest = TypeOf<typeof createSessionSchema>;
