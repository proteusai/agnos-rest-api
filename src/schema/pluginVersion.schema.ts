import { boolean, object, string, TypeOf } from "zod";

const params = {
  params: object({
    id: string({
      required_error: "Plugin version ID is required",
    }),
  }),
};

const payload = {
  body: object({
    name: string().optional(),
    config: string().optional(),
    description: string().optional(),
    published: boolean().optional(),
  }),
};

const query = {
  query: object({
    plugin: string().optional(),
    populate: string().optional(),
  }),
};

export const createPluginVersionSchema = object({
  body: object({
    name: string({
      required_error: "Plugin version name is required",
    }),
    config: string({
      required_error: "Plugin version config is required",
    }),
    description: string().optional(),
    plugin: string({
      required_error: "Plugin ID is required",
    }),
    published: boolean().optional(),
  }),
});

export const getPluginVersionSchema = object({
  ...params,
  ...query,
});

export const getPluginVersionsSchema = object({
  ...query,
});

export const updatePluginVersionSchema = object({
  ...payload,
  ...params,
});

export type CreatePluginVersionInput = TypeOf<typeof createPluginVersionSchema>;
export type GetPluginVersionInput = TypeOf<typeof getPluginVersionSchema>;
export type GetPluginVersionsInput = TypeOf<typeof getPluginVersionsSchema>;
export type UpdatePluginVersionInput = TypeOf<typeof updatePluginVersionSchema>;
