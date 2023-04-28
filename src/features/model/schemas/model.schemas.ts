import { MODEL_ID_MISSING, NAME_MISSING, PROJECT_ID_MISSING } from "@constants/errors";
import { object, string, enum as zodEnum, TypeOf } from "zod";

const paramsForOne = {
  params: object({
    model: string({
      required_error: MODEL_ID_MISSING,
    }),
    project: string({
      required_error: PROJECT_ID_MISSING,
    }),
  }),
};

const params = {
  params: object({
    project: string({
      required_error: PROJECT_ID_MISSING,
    }),
  }),
};

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateModelRequestBody:
 *      type: object
 *      required:
 *        - name
 *        - schema
 *      properties:
 *        name:
 *          type: string
 *          example: Test Model
 *        description:
 *          type: string
 *          example: A test model
 *        events:
 *          type: array
 *          items:
 *              $ref: '#/components/schemas/ModelEvent'
 *        schema:
 *          type: object
 *          additionalProperties: true
 *    CreateModelResponse:
 *      type: object
 *      properties:
 *        data:
 *          $ref: '#/components/schemas/Model'
 *    GetModelResponse:
 *      type: object
 *      properties:
 *        data:
 *          $ref: '#/components/schemas/Model'
 *    GetModelsResponse:
 *      type: array
 *      items:
 *        $ref: '#/components/schemas/Model'
 */
export const createModelRequestSchema = object({
  body: object({
    name: string({
      required_error: NAME_MISSING,
    }),
    description: string().optional(),
    events: object({
      type: zodEnum([
        "model_created",
        "model_updated",
        "model_deleted",
        "model_field_created",
        "model_field_updated",
        "model_field_deleted",
      ] as const),
      model: string().optional(),
      before: object({}).optional(),
      after: object({}).optional(),
    })
      .array()
      .optional(),
    schema: object({}).optional(),
  }),
  ...params,
});

/**
 * @openapi
 * components:
 *  schemas:
 *    GetModelResponse:
 *      type: object
 *      properties:
 *        data:
 *          $ref: '#/components/schemas/Model'
 */
export const getModelRequestSchema = object({
  ...paramsForOne,
});

/**
 * @openapi
 * components:
 *  schemas:
 *    GetModelsResponse:
 *      type: object
 *      properties:
 *        data:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Model'
 */
export const getModelsRequestSchema = object({
  ...params,
});

export type CreateModelRequest = TypeOf<typeof createModelRequestSchema>;
export type GetModelRequest = TypeOf<typeof getModelRequestSchema>;
export type GetModelsRequest = TypeOf<typeof getModelsRequestSchema>;
