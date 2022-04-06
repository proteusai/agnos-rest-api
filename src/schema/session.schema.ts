import { object, string, TypeOf } from "zod";

export const createSessionSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }),
    password: string().optional(),
  }),
});

export type CreateSessionInput = TypeOf<typeof createSessionSchema>;
