import { COLLABORATION_ID_MISSING } from "@constants/errors";
import { object, string, TypeOf } from "zod";

const params = {
  params: object({
    id: string({
      required_error: COLLABORATION_ID_MISSING,
    }),
  }),
};

/**
 * @openapi
 * components:
 *  schemas:
 *    GetCollaborationResponse:
 *      type: object
 *      properties:
 *        data:
 *          $ref: '#/components/schemas/Collaboration'
 *    GetCollaborationsResponse:
 *      type: array
 *      items:
 *        $ref: '#/components/schemas/Collaboration'
 */
export const getCollaborationRequestSchema = object({
  ...params,
});

export type GetCollaborationRequest = TypeOf<typeof getCollaborationRequestSchema>;
