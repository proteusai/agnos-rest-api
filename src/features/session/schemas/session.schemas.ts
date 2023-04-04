import { EMAIL_INVALID, ACCESS_TOKEN_MISSING, EMAIL_MISSING, ID_TOKEN_MISSING } from "@constants/errors";
import { object, string, TypeOf } from "zod";

/**
 * @openapi
 * components:
 *  schemas:
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
export const createSessionRequestSchema = object({
  body: object({
    email: string({
      required_error: EMAIL_MISSING,
    }).email(EMAIL_INVALID),
    accessToken: string({
      required_error: ACCESS_TOKEN_MISSING,
    }),
    idToken: string({
      required_error: ID_TOKEN_MISSING,
    }),
  }),
});

export type CreateSessionRequest = TypeOf<typeof createSessionRequestSchema>;
