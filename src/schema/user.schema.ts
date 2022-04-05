import { object, string, boolean, TypeOf } from "zod";

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUserInput:
 *      type: object
 *      required:
 *        - name
 *        - email
 *      optional:
 *        - emailIsVerified
 *        - password
 *        - passwordConfirmation
 *        - picture
 *      properties:
 *        name:
 *          type: string
 *          default: Jane Doe
 *        email:
 *          type: string
 *          default: jane.doe@example.com
 *        emailIsVerified:
 *          type: boolean
 *          default: false
 *        password:
 *          type: string
 *          default: stringPassword123
 *        passwordConfirmation:
 *          type: string
 *          default: stringPassword123
 *        picture:
 *          type: string
 *          default: https://content.com/image.png
 *    CreateUserResponse:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        name:
 *          type: string
 *        email:
 *          type: string
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 */

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
    emailIsVerified: boolean().optional(),
    password: string().min(6, "Password too short - should be 6 chars minimum").optional(),
    passwordConfirmation: string().optional(),
    picture: string().optional(),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});

export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  "body.passwordConfirmation"
>;
