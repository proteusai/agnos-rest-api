import { MEMBERSHIP_ID_MISSING } from "@constants/errors";
import { object, string, TypeOf } from "zod";

const params = {
  params: object({
    id: string({
      required_error: MEMBERSHIP_ID_MISSING,
    }),
  }),
};

/**
 * @openapi
 * components:
 *  schemas:
 *    GetMembershipResponse:
 *      type: object
 *      properties:
 *        data:
 *          $ref: '#/components/schemas/Membership'
 *    GetMembershipsResponse:
 *      type: array
 *      items:
 *        $ref: '#/components/schemas/Membership'
 */
export const getMembershipRequestSchema = object({
  ...params,
});

export type GetMembershipRequest = TypeOf<typeof getMembershipRequestSchema>;
