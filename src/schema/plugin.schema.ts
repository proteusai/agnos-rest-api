import { boolean, object, string, TypeOf } from "zod";

const params = {
  params: object({
    id: string({
      required_error: "Plugin ID is required",
    }),
  }),
};

const query = {
  query: object({
    populate: string().optional(),
    team: string().optional(),
  }),
};

export const createPluginSchema = object({
  body: object({
    name: string({
      required_error: "Plugin name is required",
    }),
    description: string().optional(),
    picture: string().optional(),
    private: boolean().optional(),
    team: string().optional(),
  }),
});

export const getPluginSchema = object({
  ...params,
  ...query,
});

export const getPluginsSchema = object({
  ...query,
});

export type CreatePluginInput = TypeOf<typeof createPluginSchema>;
export type GetPluginInput = TypeOf<typeof getPluginSchema>;
export type GetPluginsInput = TypeOf<typeof getPluginsSchema>;
