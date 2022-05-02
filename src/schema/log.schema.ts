import { object, string, TypeOf } from "zod";

const query = {
  query: object({
    source: string().optional(),
    populate: string().optional(),
  }),
};

export const getLogsSchema = object({
  ...query,
});

export type GetLogsInput = TypeOf<typeof getLogsSchema>;
