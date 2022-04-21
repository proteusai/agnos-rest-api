import { Router } from "express";
import {
  createTeamHandler,
  getTeamHandler,
  getTeamsHandler,
} from "../controllers/team.controller";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import {
  createTeamSchema,
  getTeamSchema,
  getTeamsSchema,
} from "../schema/team.schema";

const router = Router();

router.get(
  "/teams/:id",
  [validateResource(getTeamSchema), /**checkAuth0AccessToken,**/ requireUser],
  getTeamHandler
);

router.get(
  "/teams",
  [validateResource(getTeamsSchema), /**checkAuth0AccessToken,**/ requireUser],
  getTeamsHandler
);

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
