import { boolean, object, string, TypeOf } from "zod";

const params = {
  params: object({
    id: string({
      required_error: "Function version ID is required",
    }),
  }),
};

const query = {
  query: object({
    function: string().optional(),
    populate: string().optional(),
  }),
};

export const createFunctionVersionSchema = object({
  body: object({
    name: string({
      required_error: "Function version name is required",
    }),
    code: string({
      required_error: "Function version code is required",
    }),
    description: string().optional(),
    function: string({
      required_error: "Function ID is required",
    }),
    published: boolean().optional(),
    secrets: object({}).optional(),
  }),
});

export const getFunctionVersionSchema = object({
  ...params,
  ...query,
});

export const getFunctionVersionsSchema = object({
  ...query,
});

export type CreateFunctionVersionInput = TypeOf<
  typeof createFunctionVersionSchema
>;
export type GetFunctionVersionInput = TypeOf<typeof getFunctionVersionSchema>;
export type GetFunctionVersionsInput = TypeOf<typeof getFunctionVersionsSchema>;
