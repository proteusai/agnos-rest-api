import { Router } from "express";
import { getMembershipsHandler } from "@controllers/membership";
import requireUser from "@middleware/requireUser";
import checkAuth0AccessToken from "@middleware/checkAuth0AccessToken";
import queryParser from "@middleware/queryParser";

const router = Router();

/**
 * @openapi
 * '/memberships':
 *  get:
 *    summary: Get user's memberships
 *    description: Get user's memberships
 *    tags:
 *      - Membership
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GetMembershipsResponse'
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized access
 */
router.get("/memberships", [checkAuth0AccessToken, requireUser, queryParser], getMembershipsHandler);

export default router;
