import { DESIGN_ID_MISSING, NAME_MISSING, PROJECT_ID_MISSING } from "@constants/errors";
import { object, string, TypeOf } from "zod";

const paramsForOne = {
  params: object({
    design: string({
      required_error: DESIGN_ID_MISSING,
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
 *    CreateDesignRequestBody:
 *      type: object
 *      required:
 *        - name
 *      properties:
 *        name:
 *          type: string
 *          example: Test Design
 *        description:
 *          type: string
 *          example: A test design
 *        picture:
 *          type: string
 *          example: https://content.com/image.png
 *    CreateDesignResponse:
 *      type: object
 *      properties:
 *        data:
 *          $ref: '#/components/schemas/Design'
 *    GetDesignResponse:
 *      type: object
 *      properties:
 *        data:
 *          $ref: '#/components/schemas/Design'
 *    GetDesignsResponse:
 *      type: array
 *      items:
 *        $ref: '#/components/schemas/Design'
 */
export const createDesignRequestSchema = object({
  body: object({
    name: string({
      required_error: NAME_MISSING,
    }),
    description: string().optional(),
    picture: string().optional(),
  }),
  ...params,
});

/**
 * @openapi
 * components:
 *  schemas:
 *    GetDesignResponse:
 *      type: object
 *      properties:
 *        data:
 *          $ref: '#/components/schemas/Design'
 */
export const getDesignRequestSchema = object({
  ...paramsForOne,
});

/**
 * @openapi
 * components:
 *  schemas:
 *    GetDesignsResponse:
 *      type: object
 *      properties:
 *        data:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Design'
 */
export const getDesignsRequestSchema = object({
  ...params,
});

export type CreateDesignRequest = TypeOf<typeof createDesignRequestSchema>;
export type GetDesignRequest = TypeOf<typeof getDesignRequestSchema>;
export type GetDesignsRequest = TypeOf<typeof getDesignsRequestSchema>;
