export interface License {
  name: string;
  description: string;
  duration: number; // in days
  perpetual: boolean; // if true duration is ignored
  price: number; // in dollars
}

/**
 * @openapi
 * components:
 *  schemas:
 *    License:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *        currency:
 *          type: string
 *        description:
 *          type: string
 *        duration:
 *          type: number
 *        perpetual:
 *          type: boolean
 *        price:
 *          type: number
 */
export const LicenseSchema = {
  name: { type: String, required: true },
  currency: { type: String, default: "usd" },
  description: { type: String },
  duration: { type: Number },
  perpetual: { type: Boolean, default: true },
  price: { type: Number },
};
