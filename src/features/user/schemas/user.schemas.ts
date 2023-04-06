import { EMAIL_INVALID, EMAIL_MISSING, NAME_MISSING, PASSWORD_MISMATCH, PASSWORD_TOO_SHORT } from "@constants/errors";
import { object, string, boolean, TypeOf } from "zod";

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUserRequestBody:
 *      type: object
 *      required:
 *        - name
 *        - email
 *      properties:
 *        name:
 *          type: string
 *          example: Jane Doe
 *        email:
 *          type: string
 *          example: jane.doe@example.com
 *        emailIsVerified:
 *          type: boolean
 *          example: false
 *        password:
 *          type: string
 *          example: stringPassword123
 *        passwordConfirmation:
 *          type: string
 *          example: stringPassword123
 *        picture:
 *          type: string
 *          example: https://content.com/image.png
 *    CreateUserResponse:
 *      type: object
 *      properties:
 *        data:
 *          $ref: '#/components/schemas/User'
 */

export const createUserRequestSchema = object({
  body: object({
    name: string({
      required_error: NAME_MISSING,
    }),
    email: string({
      required_error: EMAIL_MISSING,
    }).email(EMAIL_INVALID),
    emailIsVerified: boolean().default(false).optional(),
    password: string().min(6, PASSWORD_TOO_SHORT).optional(),
    passwordConfirmation: string().optional(),
    picture: string().optional(),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: PASSWORD_MISMATCH,
    path: ["passwordConfirmation"],
  }),
});

export type CreateUserRequest = Omit<TypeOf<typeof createUserRequestSchema>, "body.passwordConfirmation">;
