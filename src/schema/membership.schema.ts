import { enum as zodEnum, object, string, TypeOf } from "zod";

const query = {
  query: object({
    populate: string().optional(),
  }),
};

/**
 * @openapi
 * components:
 *  schemas:
 *    Membership:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
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
    org: string({
      required_error: "Org ID is required",
    }),
    team: string(),
    //permission: union([
    //   literal("GUEST"),
    //   literal("MEMBER"),
    //   literal("OWNER"),
    // ]).default("GUEST"),
    role: zodEnum(["GUEST", "MEMBER", "OWNER"] as const).default("MEMBER"),
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
