export interface Data {
  files?: { [path: string]: File };
  inputs?: { [name: string]: Variable };
  outputs?: { [name: string]: Variable };
}

export interface File {
  type: "file" | "folder" | "href";
  content: string;
}

export interface Variable {
  type: "ref" | "value";
  value: string;
}

/**
 * @openapi
 * components:
 *  schemas:
 *    File:
 *      type: object
 *      required:
 *        - content
 *        - type
 *      properties:
 *        content:
 *          type: string
 *        type:
 *          type: string
 *          enum:
 *              - file
 *              - folder
 *              - href
 */
export const FileSchema = {
  type: {
    type: String,
    enum: ["file", "folder", "href"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
};

/**
 * @openapi
 * components:
 *  schemas:
 *    Variable:
 *      type: object
 *      required:
 *        - type
 *        - value
 *      properties:
 *        type:
 *          type: string
 *          enum:
 *              - ref
 *              - value
 *        value:
 *          type: string
 */
export const VariableSchema = {
  type: {
    type: String,
    enum: ["ref", "value"],
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
};

/**
 * @openapi
 * components:
 *  schemas:
 *    Data:
 *      type: object
 *      properties:
 *        files:
 *          type: object
 *          additionalProperties:
 *              $ref: '#/components/schemas/File'
 *        inputs:
 *          type: object
 *          additionalProperties:
 *              $ref: '#/components/schemas/Variable'
 *        outputs:
 *          type: object
 *          additionalProperties:
 *              $ref: '#/components/schemas/Variable'
 */
export const DataSchema = {
  files: {
    type: Map,
    of: FileSchema,
  },
  inputs: {
    type: Map,
    of: VariableSchema,
  },
  outputs: {
    type: Map,
    of: VariableSchema,
  },
};
