export interface Form {
  title: string;
  actions?: Array<FormAction>;
  disableNavigation: boolean; // if true you can't navigate to the Next or Previous form
  fields?: Array<FormField | FormFieldGroup>;
}

export interface FormAction {
  title: string;
  run: string;
  transform?: string;
}

export interface FormField {
  name: string;
  title: string;
  default?: unknown;
  type?: HTMLInputTypeAttribute;
}

export interface FormFieldGroup {
  title: string;
  fields?: Array<FormField | FormFieldGroup>;
}

type HTMLInputTypeAttribute =
  | "button"
  | "checkbox"
  | "color"
  | "date"
  | "datetime-local"
  | "email"
  | "file"
  | "hidden"
  | "image"
  | "month"
  | "multi-select"
  | "number"
  | "password"
  | "radio"
  | "range"
  | "rating"
  | "reset"
  | "search"
  | "select"
  | "submit"
  | "switch"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week";

const htmlInputTypes = [
  "button",
  "checkbox",
  "color",
  "date",
  "datetime-local",
  "email",
  "file",
  "hidden",
  "image",
  "month",
  "multi-select",
  "number",
  "password",
  "radio",
  "range",
  "rating",
  "reset",
  "search",
  "select",
  "submit",
  "switch",
  "tel",
  "text",
  "time",
  "url",
  "week",
];

export const FormFieldSchema = {
  name: { type: String, required: true },
  title: { type: String, required: true },
  default: { type: {} },
  required: { type: Boolean },
  type: { type: String, enum: htmlInputTypes, default: "text" },
};

export const FormFieldGroupSchema = {
  title: { type: String, required: true },
  fields: [FormFieldSchema], // not perfect because FormFieldGroups should be able to contain other FormFieldGroups
};

export const FormFieldOrFormFieldGroupSchema = {
  ...FormFieldSchema,
  ...FormFieldGroupSchema,
};

export const FormActionSchema = {
  title: { type: String, required: true },
  run: { type: String, required: true },
  transform: { type: String },
};

/**
 * @openapi
 * components:
 *  schemas:
 *    Form:
 *      type: object
 *      properties:
 *        disableNavigation:
 *          type: boolean
 *        title:
 *          type: string
 */
export const FormSchema = {
  title: { type: String, required: true },
  actions: [FormActionSchema],
  disableNavigation: { type: Boolean, default: false },
  fields: [FormFieldOrFormFieldGroupSchema],
};
