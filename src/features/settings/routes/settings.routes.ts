import { Router } from "express";
import validateResource from "@middleware/validateResource";
import requireUser from "@middleware/requireUser";
import checkAuth0AccessToken from "@middleware/checkAuth0AccessToken";
import { getSettingsHandler, updateSettingsHandler } from "@controllers/settings";
import { updateSettingsRequestSchema } from "@schemas/settings";

const router = Router();

/**
 * @openapi
 * '/settings':
 *  get:
 *    summary: Get user settings
 *    description: Get user settings
 *    tags:
 *      - Settings
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GetSettingsResponse'
 *      400:
 *        description: Bad request
 *      403:
 *        description: Forbidden
 */
router.get("/settings", [checkAuth0AccessToken, requireUser], getSettingsHandler);

/**
 * @openapi
 * '/settings':
 *  patch:
 *    summary: Update user settings
 *    description: Update user settings
 *    tags:
 *      - Settings
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/UpdateSettingsRequestBody'
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UpdateSettingsResponse'
 *      400:
 *        description: Bad request
 *      403:
 *        description: Forbidden
 */
router.patch(
  "/settings",
  [validateResource(updateSettingsRequestSchema), checkAuth0AccessToken, requireUser],
  updateSettingsHandler
);

export default router;
