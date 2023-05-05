import { NAME_MISSING, COMPONENT_ID_MISSING } from "@constants/errors";
import { enum as zodEnum, object, string, boolean, TypeOf } from "zod";

const params = {
  params: object({
    component: string({
      required_error: COMPONENT_ID_MISSING,
    }),
  }),
};

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateComponentRequestBody:
 *      type: object
 *      required:
 *        - name
 *      properties:
 *        name:
 *          type: string
 *          example: Test Component
 *        description:
 *          type: string
 *          example: A test component
 *        form:
 *          $ref: '#/components/schemas/Form'
 *        onEnvChanged:
 *          type: string
 *        onEnvDeployed:
 *          type: string
 *        onInit:
 *          type: string
 *        onModelChanged:
 *          type: string
 *        org:
 *          type: string
 *          example: 12543667890754309
 *        private:
 *          type: boolean
 *          example: false
 *        picture:
 *          type: string
 *          example: https://content.com/image.png
 *        scopes:
 *          type: array
 *          items:
 *            type: string
 *            enum:
 *              - read:design
 *              - read:environment
 *              - read:org
 *              - read:project
 *              - read:user
 *        supportedEnvLocations:
 *          type: array
 *          items:
 *            type: string
 *        tags:
 *          type: array
 *          items:
 *            type: string
 *        version:
 *          type: string
 *    CreateComponentResponse:
 *      type: object
 *      properties:
 *        data:
 *          $ref: '#/components/schemas/Component'
 *    GetComponentResponse:
 *      type: object
 *      properties:
 *        data:
 *          $ref: '#/components/schemas/Component'
 *    GetComponentsResponse:
 *      type: array
 *      items:
 *        $ref: '#/components/schemas/Component'
 */
export const createComponentRequestSchema = object({
  body: object({
    name: string({
      required_error: NAME_MISSING,
    }),
    description: string().optional(),
    form: object({
      formData: object({}).optional(),
      jsonSchema: object({}),
      uiSchema: object({}).optional(),
    }).optional(),
    onEnvChanged: string().optional(),
    onEnvDeployed: string().optional(),
    onInit: string().optional(),
    onModelChanged: string().optional(),
    org: string().optional(), // if missing, create the component under the user's personal org (and set component.personal to true)
    private: boolean().optional(),
    picture: string().optional(),
    scopes: zodEnum(["read:design", "read:environment", "read:org", "read:project", "read:user"] as const)
      .array()
      .optional(),
    supportedEnvLocations: string().array().optional(),
    tags: string().array().optional(),
    version: string(),
  }),
});

/**
 * @openapi
 * components:
 *  schemas:
 *    GetComponentResponse:
 *      type: object
 *      properties:
 *        data:
 *          $ref: '#/components/schemas/Component'
 *    GetComponentsResponse:
 *      type: object
 *      properties:
 *        data:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Component'
 */
export const getComponentRequestSchema = object({
  ...params,
});

export type CreateComponentRequest = TypeOf<typeof createComponentRequestSchema>;
export type GetComponentRequest = TypeOf<typeof getComponentRequestSchema>;
