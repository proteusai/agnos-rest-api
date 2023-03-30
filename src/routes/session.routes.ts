import { Router } from "express";
import validateResource from "../middleware/validateResource";
import requireUser from "../middleware/requireUser";
import {
  createUserSessionHandler,
  deleteSessionHandler,
  getUserSessionsHandler,
} from "../controllers/session.controller";
import { createSessionSchema } from "../schema/session.schema";
import checkAuth0IdToken from "../middleware/checkAuth0IdToken";
import checkAuth0AccessToken from "../middleware/checkAuth0AccessToken";

const router = Router();

/**
 * @openapi
 * '/sessions':
 *  post:
 *    summary: Create a user session
 *    description: Create a user session
 *    tags:
 *      - Session
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/CreateSessionRequestBody'
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateSessionResponse'
 *      400:
 *        description: Bad request
 *      401:
 *        description: Missing or invalid ID token, invalid access token
 */
router.post(
  "/sessions",
  [validateResource(createSessionSchema), checkAuth0AccessToken, checkAuth0IdToken],
  createUserSessionHandler
);

/**
 * @openapi
 * '/sessions':
 *  get:
 *    summary: Get user sessions
 *    description: Get user sessions
 *    tags:
 *      - Session
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GetSessionsResponse'
 *      400:
 *        description: Bad request
 *      403:
 *        description: Forbidden
 */
router.get("/sessions", [checkAuth0AccessToken, requireUser], getUserSessionsHandler);

/**
 * @openapi
 * '/sessions':
 *  delete:
 *    summary: Soft-delete a user session
 *    description: Soft-delete a user session
 *    tags:
 *      - Session
 *    responses:
 *      204:
 *        description: Success
 *      403:
 *        description: Forbidden
 */
router.delete("/sessions", [checkAuth0AccessToken, requireUser], deleteSessionHandler);

export default router;
