import { boolean, enum as zodEnum, object, string, TypeOf } from "zod";

const params = {
  params: object({
    id: string({
      required_error: "Function version ID is required",
    }),
  }),
};

const payload = {
  body: object({
    name: string().optional(),
    code: string().optional(),
    description: string().optional(),
    published: boolean().optional(),
    scopes: zodEnum(["READ:DESIGN", "READ:ENVIRONMENT", "READ:USER"] as const)
      .array()
      .optional(),
    secrets: object({}).optional(),
    testData: string().optional(),
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
    scopes: zodEnum(["READ:DESIGN", "READ:ENVIRONMENT", "READ:USER"] as const)
      .array()
      .optional(),
    secrets: object({}).optional(),
    testData: string().optional(),
  }),
});

export const runFunctionVersionSchema = object({
  body: object({
    form: object({}).optional(),
  }),
  ...params,
  query: object({
    test: string().optional(),
  }),
});

export const getFunctionVersionSchema = object({
  ...params,
  ...query,
});

export const getFunctionVersionsSchema = object({
  ...query,
});

export const updateFunctionVersionSchema = object({
  ...payload,
  ...params,
});

export type CreateFunctionVersionInput = TypeOf<
  typeof createFunctionVersionSchema
>;
export type GetFunctionVersionInput = TypeOf<typeof getFunctionVersionSchema>;
export type GetFunctionVersionsInput = TypeOf<typeof getFunctionVersionsSchema>;
export type RunFunctionVersionInput = TypeOf<typeof runFunctionVersionSchema>;
export type UpdateFunctionVersionInput = TypeOf<
  typeof updateFunctionVersionSchema
>;
