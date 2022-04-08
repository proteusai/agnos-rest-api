import { object, string, TypeOf } from "zod";

export const createSessionSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }),
    accessToken: string({
      required_error: "Access token is required",
    }),
    idToken: string({
      required_error: "ID token is required",
    }),
  }),
});

export type CreateSessionInput = TypeOf<typeof createSessionSchema>;
