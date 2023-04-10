import { boolean, enum as zodEnum, object, TypeOf } from "zod";

/**
 * @openapi
 * components:
 *  schemas:
 *    UpdateSettingsRequestBody:
 *      type: object
 *      properties:
 *        autoSave:
 *          type: boolean
 *          example: true
 *        colorMode:
 *          type: string
 *          enum:
 *           - DARK
 *           - LIGHT
 *          example: DARK
 *        useGrayscaleIcons:
 *          type: boolean
 *          example: true
 *    UpdateSettingsResponse:
 *      type: object
 *      properties:
 *        data:
 *          $ref: '#/components/schemas/Settings'
 *    GetSettingsResponse:
 *      type: object
 *      properties:
 *        data:
 *          $ref: '#/components/schemas/Settings'
 */
export const updateSettingsRequestSchema = object({
  body: object({
    autoSave: boolean().optional(),
    colorMode: zodEnum(["DARK", "LIGHT"] as const).default("LIGHT"),
    useGrayscaleIcons: boolean().optional(),
  }),
});

export type UpdateSettingsRequest = TypeOf<typeof updateSettingsRequestSchema>;
