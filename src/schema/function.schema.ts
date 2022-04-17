import { boolean, object, string, TypeOf } from "zod";

const params = {
  params: object({
    id: string({
      required_error: "Function ID is required",
    }),
  }),
};

const query = {
  query: object({
    populate: string().optional(),
    team: string().optional(),
  }),
};

export const createFunctionSchema = object({
  body: object({
    name: string({
      required_error: "Function name is required",
    }),
    description: string().optional(),
    picture: string().optional(),
    private: boolean().optional(),
    secrets: object({}).optional(),
    team: string().optional(),
  }),
});

export const getFunctionSchema = object({
  ...params,
  ...query,
});

export const getFunctionsSchema = object({
  ...query,
});

export type CreateFunctionInput = TypeOf<typeof createFunctionSchema>;
export type GetFunctionInput = TypeOf<typeof getFunctionSchema>;
export type GetFunctionsInput = TypeOf<typeof getFunctionsSchema>;
