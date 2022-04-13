import { boolean, object, TypeOf } from "zod";

export const createSettingsSchema = object({
  body: object({
    autoSave: boolean().optional(),
    useGrayscaleIcons: boolean().optional(),
  }),
});

export type CreateSettingsInput = TypeOf<typeof createSettingsSchema>;
