import { boolean, object, string, TypeOf } from "zod";

const params = {
  params: object({
    id: string({
      required_error: "Design ID is required",
    }),
  }),
};

export const createDesignSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    description: string().optional(),
    flow: object({}).optional(),
    private: boolean().optional(),
    picture: string().optional(),
    secrets: object({}).optional(),
    team: string().optional(),
  }),
});

export const getDesignSchema = object({
  ...params,
});

export type CreateDesignInput = TypeOf<typeof createDesignSchema>;
export type GetDesignInput = TypeOf<typeof getDesignSchema>;
