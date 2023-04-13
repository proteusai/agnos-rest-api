import { Router } from "express";
import { createOrgHandler, getOrgHandler, getOrgsHandler } from "@controllers/org";
import requireUser from "@middleware/requireUser";
import validateResource from "@middleware/validateResource";
import { createOrgRequestSchema, getOrgRequestSchema, getOrgsRequestSchema } from "@schemas/org";

const router = Router();

router.get(
  "/orgs/:id",
  [validateResource(getOrgRequestSchema), /**checkAuth0AccessToken,**/ requireUser],
  getOrgHandler
);

router.get("/orgs", [validateResource(getOrgsRequestSchema), /**checkAuth0AccessToken,**/ requireUser], getOrgsHandler);

/**
 * @openapi
 * '/teams':
 *  post:
 *     tags:
 *     - Team
 *     summary: Create a team
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/CreateTeamInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateTeamResponse'
 *      400:
 *        description: Bad request
 */
router.post(
  "/orgs",
  [validateResource(createOrgRequestSchema), /**checkAuth0AccessToken,**/ requireUser],
  createOrgHandler
);

export default router;
