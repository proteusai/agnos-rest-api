import { Router } from "express";
import requireUser from "@middleware/requireUser";
import validateResource from "@middleware/validateResource";
import { createProjectRequestSchema, getProjectRequestSchema } from "@schemas/project";
import {
  createProjectHandler,
  createProjectModelHandler,
  getProjectHandler,
  getProjectsHandler,
  updateProjectCanvasHandler,
} from "@controllers/project";
import checkAuth0AccessToken from "@middleware/checkAuth0AccessToken";
import queryParser from "@middleware/queryParser";
import requireUserRole from "@middleware/requireUserRole";
import { PermissionName, RoleName } from "@constants/permissions";
import requireUserPermission from "@middleware/requireUserPermission";
import { createModelRequestSchema } from "@schemas/model";
import { updateCanvasRequestSchema } from "@schemas/canvas";

const router = Router();

/**
 * @openapi
 * '/projects':
 *  get:
 *    summary: Get public projects
 *    description: Get public projects
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
 * '/projects/{project}':
 *  get:
 *    summary: Get a project
 *    description: Get a project
 *    tags:
 *      - Project
 *    parameters:
 *      - name: project
 *        in: path
 *        description: Project ID
 *        required: true
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
  "/projects/:project",
  [
    validateResource(getProjectRequestSchema),
    checkAuth0AccessToken,
    requireUser,
    requireUserPermission(PermissionName.read, "project", "params.project"),
    queryParser,
  ],
  getProjectHandler
);

// TODO: GET /projects/:project/collaborations

/**
 * @openapi
 * '/projects/{project}/canvas':
 *  post:
 *    summary: Update a project's canvas
 *    description: Update a project's canvas
 *    tags:
 *      - Project
 *    parameters:
 *      - name: project
 *        in: path
 *        description: Project ID
 *        required: true
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/UpdateCanvasRequestBody'
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UpdateCanvasResponse'
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized access
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Not found
 */
router.patch(
  "/projects/:project/canvas",
  [
    validateResource(updateCanvasRequestSchema),
    checkAuth0AccessToken,
    requireUser,
    requireUserPermission(PermissionName.write, "project", "params.project"),
  ],
  updateProjectCanvasHandler
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
    requireUserRole(RoleName.owner, "body.org"),
  ],
  createProjectHandler
);

/**
 * @openapi
 * '/projects/{project}/models':
 *  post:
 *    summary: Create a project model
 *    description: Create a project model
 *    tags:
 *      - Project
 *    parameters:
 *      - name: project
 *        in: path
 *        description: Project ID
 *        required: true
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/CreateModelRequestBody'
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateModelResponse'
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
  "/projects/:project/models",
  [
    validateResource(createModelRequestSchema),
    checkAuth0AccessToken,
    requireUser,
    requireUserPermission(PermissionName.write, "project", "params.project"),
  ],
  createProjectModelHandler
);

export default router;
