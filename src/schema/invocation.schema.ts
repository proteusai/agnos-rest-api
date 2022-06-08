import { object, string, TypeOf } from "zod";

const query = {
  query: object({
    function: string().optional(),
    populate: string().optional(),
    version: string().optional(),
  }),
};

export const getInvocationsSchema = object({
  ...query,
});

export type GetInvocationsInput = TypeOf<typeof getInvocationsSchema>;
