import { literal, object, string, TypeOf, union } from "zod";

const query = {
  query: object({
    populate: string().optional(),
  }),
};

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
 *        user:
 *          type: string
 *        team:
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
    user: string({
      required_error: "User ID is required",
    }),
    team: string({
      required_error: "Team ID is required",
    }),
    permission: union([
      literal("READ"),
      literal("WRITE"),
      literal("ADMIN"),
    ]).default("READ"),
  }),
});

export const getMembershipSchema = object({
  ...query,
});

export const getMembershipsSchema = object({
  ...query,
});

export type CreateMembershipInput = TypeOf<typeof createMembershipSchema>;

export type GetMembershipInput = TypeOf<typeof getMembershipSchema>;

export type GetMembershipsInput = TypeOf<typeof getMembershipsSchema>;
