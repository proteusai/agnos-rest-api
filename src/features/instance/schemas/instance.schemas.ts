import { DESIGN_ID_MISSING, INSTANCE_ID_MISSING, NAME_MISSING, PROJECT_ID_MISSING } from "@constants/errors";
import { object, string, TypeOf } from "zod";

const paramsForOne = {
  params: object({
    design: string({
      required_error: DESIGN_ID_MISSING,
    }),
    instance: string({
      required_error: INSTANCE_ID_MISSING,
    }),
    project: string({
      required_error: PROJECT_ID_MISSING,
    }),
  }),
};

const params = {
  params: object({
    design: string({
      required_error: DESIGN_ID_MISSING,
    }),
    project: string({
      required_error: PROJECT_ID_MISSING,
    }),
  }),
};

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateInstanceRequestBody:
 *      type: object
 *      required:
 *        - name
 *      properties:
 *        name:
 *          type: string
 *          example: Test Instance
 *        component:
 *          type: string
 *        description:
 *          type: string
 *          example: A test instance
 *        installation:
 *          type: string
 *    CreateInstanceResponse:
 *      type: object
 *      properties:
 *        data:
 *          $ref: '#/components/schemas/Instance'
 *    GetInstanceResponse:
 *      type: object
 *      properties:
 *        data:
 *          $ref: '#/components/schemas/Instance'
 *    GetInstancesResponse:
 *      type: array
 *      items:
 *        $ref: '#/components/schemas/Instance'
 */
export const createInstanceRequestSchema = object({
  body: object({
    name: string({
      required_error: NAME_MISSING,
    }),
    component: string().optional(),
    description: string().optional(),
    installation: string().optional(),
  }),
  ...params,
});

/**
 * @openapi
 * components:
 *  schemas:
 *    GetInstanceResponse:
 *      type: object
 *      properties:
 *        data:
 *          $ref: '#/components/schemas/Instance'
 */
export const getInstanceRequestSchema = object({
  ...paramsForOne,
});

/**
 * @openapi
 * components:
 *  schemas:
 *    GetInstancesResponse:
 *      type: object
 *      properties:
 *        data:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Instance'
 */
export const getInstancesRequestSchema = object({
  ...params,
});

export type CreateInstanceRequest = TypeOf<typeof createInstanceRequestSchema>;
export type GetInstanceRequest = TypeOf<typeof getInstanceRequestSchema>;
export type GetInstancesRequest = TypeOf<typeof getInstancesRequestSchema>;
