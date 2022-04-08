import { Router } from "express";
import {
  createUserHandler,
  findMeHandler,
} from "../controllers/user.controller";
import { createUserSchema } from "../schema/user.schema";
import validateResource from "../middleware/validateResource";
import requireUser from "../middleware/requireUser";

const router = Router();

router.get("/me", [/**checkAuth0AccessToken,**/ requireUser], findMeHandler);

/**
 * @openapi
 * '/api/users':
 *  post:
 *     tags:
 *     - User
 *     summary: Register a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/CreateUserInput'
 *     responses:
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
router.post("/users", validateResource(createUserSchema), createUserHandler);

export default router;
