import { boolean, enum as zodEnum, object, string, TypeOf } from "zod";

const params = {
  params: object({
    id: string({
      required_error: "Installation ID is required",
    }),
  }),
};

const query = {
  query: object({
    plugin: string().optional(),
    populate: string().optional(),
    team: string().optional(),
    version: string().optional(),
  }),
};

export const createInstallationSchema = object({
  body: object({
    plugin: string({
      required_error: "Plugin ID is required",
    }),
    version: string({
      required_error: "Plugin version ID is required",
    }),
    team: string().optional(),
  }),
});

export const getInstallationSchema = object({
  ...params,
  ...query,
});

export const getInstallationsSchema = object({
  ...query,
});

export type CreateInstallationInput = TypeOf<typeof createInstallationSchema>;
export type GetInstallationInput = TypeOf<typeof getInstallationSchema>;
export type GetInstallationsInput = TypeOf<typeof getInstallationsSchema>;
