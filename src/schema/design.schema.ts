import { boolean, object, string, TypeOf } from "zod";

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

export type CreateDesignInput = TypeOf<typeof createDesignSchema>;
