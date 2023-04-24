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
 *           - dark
 *           - light
 *          example: dark
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
    colorMode: zodEnum(["dark", "light"] as const).default("light"),
    useGrayscaleIcons: boolean().optional(),
  }),
});

export type UpdateSettingsRequest = TypeOf<typeof updateSettingsRequestSchema>;
