import { Router } from "express";
import { createTeamHandler } from "../controllers/team.controller";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import { createTeamSchema } from "../schema/team.schema";

const router = Router();

/**
 * @openapi
 * '/api/teams':
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
  "/teams",
  [
    validateResource(createTeamSchema),
    /**checkAuth0AccessToken,**/ requireUser,
  ],
  createTeamHandler
);

export default router;
