import { Router } from "express";
import { getCollaborationsHandler } from "@controllers/collaboration";
import requireUser from "@middleware/requireUser";
import checkAuth0AccessToken from "@middleware/checkAuth0AccessToken";
import queryParser from "@middleware/queryParser";

const router = Router();

/**
 * @openapi
 * '/collaboration':
 *  get:
 *    summary: Get user's collaborations
 *    description: Get user's collaborations
 *    tags:
 *      - Collaboration
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GetCollaborationsResponse'
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized access
 */
router.get("/collaborations", [checkAuth0AccessToken, requireUser, queryParser], getCollaborationsHandler);

export default router;
