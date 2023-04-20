import { Router } from "express";
import requireUser from "@middleware/requireUser";
import validateResource from "@middleware/validateResource";
import { createProjectRequestSchema, getProjectRequestSchema } from "@schemas/project";
import { createProjectHandler, getProjectHandler, getProjectsHandler } from "@controllers/project";
import checkAuth0AccessToken from "@middleware/checkAuth0AccessToken";
import queryParser from "@middleware/queryParser";
import requireUserRole from "@middleware/requireUserRole";
import { PermissionName, RoleName } from "@constants/permissions";
import requireUserPermission from "@middleware/requireUserPermission";

const router = Router();

/**
 * @openapi
 * '/projects':
 *  get:
 *    summary: Get projects
 *    description: Get projects
 *    tags:
 *      - Project
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GetProjectsResponse'
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized access
 */
// since this endpoint allows you to fetch projects from multiple orgs, we don't need to check for org roles
router.get("/projects", [checkAuth0AccessToken, requireUser, queryParser], getProjectsHandler);

/**
 * @openapi
 * '/projects/:id':
 *  get:
 *    summary: Get a project
 *    description: Get a project
 *    tags:
 *      - Project
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GetProjectResponse'
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized access
 *      403:
 *        description: Forbidden
 */
router.get(
  "/projects/:id",
  [
    validateResource(getProjectRequestSchema),
    checkAuth0AccessToken,
    requireUser,
    requireUserPermission(PermissionName.READ, "project", "params.id"),
    queryParser,
  ],
  getProjectHandler
);

/**
 * @openapi
 * '/projects':
 *  post:
 *    summary: Create a project
 *    description: Create a project
 *    tags:
 *      - Project
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/CreateProjectRequestBody'
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateProjectResponse'
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
  "/projects",
  [
    validateResource(createProjectRequestSchema),
    checkAuth0AccessToken,
    requireUser,
    requireUserRole(RoleName.MEMBER, "body.org"),
  ],
  createProjectHandler
);

export default router;
