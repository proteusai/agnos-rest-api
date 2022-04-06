import { literal, object, string, TypeOf, union } from "zod";

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateMembershipInput:
 *      type: object
 *      required:
 *        - userId
 *        - teamId
 *      properties:
 *        userId:
 *          type: string
 *        teamId:
 *          type: string
 *        permission:
 *          type: string
 *          default: READ
 *    CreateMembershipResponse:
 *      type: object
 *      properties:
 *        membership:
 *          type: object
 *          properties:
 *            _id:
 *              type: string
 *            userId:
 *              type: string
 *            teamId:
 *              type: string
 *            permission:
 *              type: string
 *            permissionValue:
 *              type: number
 *            userName:
 *              type: string
 *            userPicture:
 *              type: string
 *            teamName:
 *              type: string
 *            teamPicture:
 *              type: string
 *            createdAt:
 *              type: string
 *            updatedAt:
 *              type: string
 */

export const createMembershipSchema = object({
  body: object({
    userId: string({
      required_error: "User ID is required",
    }),
    teamId: string({
      required_error: "Team ID is required",
    }),
    permission: union([
      literal("READ"),
      literal("WRITE"),
      literal("ADMIN"),
    ]).optional(),
  }),
});

export type CreateMembershipInput = TypeOf<typeof createMembershipSchema>;
