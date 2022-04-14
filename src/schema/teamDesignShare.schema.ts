import { literal, object, string, TypeOf, union } from "zod";

const query = {
  query: object({
    populate: string().optional(),
    team: string().optional(),
  }),
};

export const createTeamDesignShareSchema = object({
  body: object({
    design: string({
      required_error: "Design ID is required",
    }),
    team: string({
      required_error: "Team ID is required",
    }),
    permission: union([
      literal("READ"),
      literal("WRITE"),
      literal("ADMIN"),
    ]).default("READ"),
  }),
});

export const getTeamDesignShareSchema = object({
  ...query,
});

export const getTeamDesignSharesSchema = object({
  ...query,
});

export type CreateTeamDesignShareInput = TypeOf<
  typeof createTeamDesignShareSchema
>;

export type GetTeamDesignShareInput = TypeOf<typeof getTeamDesignShareSchema>;

export type GetTeamDesignSharesInput = TypeOf<typeof getTeamDesignSharesSchema>;
