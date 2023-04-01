import { object, string, boolean, TypeOf } from "zod";

/**
 * @openapi
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        name:
 *          type: string
 *        email:
 *          type: string
 *        emailIsVerified:
 *          type: boolean
 *        picture:
 *          type: string
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 *    CreateUserInput:
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

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
    emailIsVerified: boolean().default(false).optional(),
    password: string().min(6, "Password too short - should be 6 chars minimum").optional(),
    passwordConfirmation: string().optional(),
    picture: string().optional(),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});

export type CreateUserInput = Omit<TypeOf<typeof createUserSchema>, "body.passwordConfirmation">;
