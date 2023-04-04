import { boolean, object, TypeOf } from "zod";

/**
 * @openapi
 * components:
 *  schemas:
 *    Settings:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 */

export const createSettingsSchema = object({
  body: object({
    autoSave: boolean().optional(),
    useGrayscaleIcons: boolean().optional(),
  }),
});

export type CreateSettingsInput = TypeOf<typeof createSettingsSchema>;
