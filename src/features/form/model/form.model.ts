export interface Form {
  formData?: object;
  jsonSchema: object;
  uiSchema?: object;
}

/**
 * @openapi
 * components:
 *  schemas:
 *    Form:
 *      type: object
 *      required:
 *        - jsonSchema
 *      properties:
 *        formData:
 *          type: object
 *          additionalProperties: true
 *        jsonSchema:
 *          type: object
 *          additionalProperties: true
 *        uiSchema:
 *          type: object
 *          additionalProperties: true
 */
export const FormSchema = {
  formData: { type: {} },
  jsonSchema: { type: {}, required: true },
  uiSchema: { type: {} },
};
