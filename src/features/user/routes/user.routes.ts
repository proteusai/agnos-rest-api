import { Router } from "express";
import { createUserHandler } from "@controllers/user";
import { createUserRequestSchema } from "@schemas/user";
import validateResource from "@middleware/validateResource";

const router = Router();

/**
 * @openapi
 * '/users':
 *  post:
 *    summary: Register a user
 *    description: Register a user
 *    tags:
 *      - User
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/CreateUserRequestBody'
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateUserResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
router.post("/users", validateResource(createUserRequestSchema), createUserHandler);

export default router;
