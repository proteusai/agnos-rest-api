import { Router } from "express";
import requireUser from "@middleware/requireUser";
import validateResource from "@middleware/validateResource";
import checkAuth0AccessToken from "@middleware/checkAuth0AccessToken";
import queryParser from "@middleware/queryParser";
import requireUserRole from "@middleware/requireUserRole";
import { PermissionName, RoleName } from "@constants/permissions";
import requireUserPermission from "@middleware/requireUserPermission";
import { createComponentHandler, getComponentHandler, getComponentsHandler } from "@controllers/component";
import { createComponentRequestSchema, getComponentRequestSchema } from "@schemas/component";

const router = Router();

/**
 * @openapi
 * '/components':
 *  get:
 *    summary: Get public components
 *    description: Get public components
 *    tags:
 *      - Component
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GetComponentsResponse'
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized access
 */
// since this endpoint allows you to fetch components from multiple orgs, we don't need to check for org roles
router.get("/components", [checkAuth0AccessToken, requireUser, queryParser], getComponentsHandler);

/**
 * @openapi
 * '/components/{component}':
 *  get:
 *    summary: Get a component
 *    description: Get a component
 *    tags:
 *      - Component
 *    parameters:
 *      - name: component
 *        in: path
 *        description: component ID
 *        required: true
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GetComponentResponse'
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized access
 *      403:
 *        description: Forbidden
 */
router.get(
  "/components/:component",
  [
    validateResource(getComponentRequestSchema),
    checkAuth0AccessToken,
    requireUser,
    requireUserPermission(PermissionName.read, "component", "params.component"),
    queryParser,
  ],
  getComponentHandler
);

// TODO: GET /components/:component/collaborations

/**
 * @openapi
 * '/components':
 *  post:
 *    summary: Create a component
 *    description: Create a component
 *    tags:
 *      - Component
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/CreateComponentRequestBody'
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateComponentResponse'
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized access
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Not found
 */
router.post(
  "/components",
  [
    validateResource(createComponentRequestSchema),
    checkAuth0AccessToken,
    requireUser,
    requireUserRole(RoleName.owner, "body.org"),
  ],
  createComponentHandler
);

export default router;
