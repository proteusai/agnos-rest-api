import { Router } from "express";
import { createOrgHandler, getOrgHandler, getOrgsHandler } from "@controllers/org";
import requireUser from "@middleware/requireUser";
import validateResource from "@middleware/validateResource";
import { createOrgRequestSchema, getOrgRequestSchema } from "@schemas/org";
import checkAuth0AccessToken from "@middleware/checkAuth0AccessToken";
import queryParser from "@middleware/queryParser";
import requireUserRole from "@middleware/requireUserRole";
import { RoleName } from "@constants/permissions";

const router = Router();

/**
 * @openapi
 * '/orgs':
 *  get:
 *    summary: Get public organizations
 *    description: Get public organizations
 *    tags:
 *      - Organization
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GetOrganizationsResponse'
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized access
 */
router.get("/orgs", [checkAuth0AccessToken, requireUser, queryParser], getOrgsHandler);

/**
 * @openapi
 * '/orgs/:id':
 *  get:
 *    summary: Get an organization
 *    description: Get an organization
 *    tags:
 *      - Organization
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GetOrganizationResponse'
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized access
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Organization not found
 */
router.get(
  "/orgs/:org",
  [
    validateResource(getOrgRequestSchema),
    checkAuth0AccessToken,
    requireUser,
    requireUserRole(RoleName.member, "params.org"),
  ],
  getOrgHandler
);

// TODO: GET /orgs/:id/memberships

/**
 * @openapi
 * '/orgs':
 *  post:
 *    summary: Create an organization
 *    description: Create an organization
 *    tags:
 *      - Organization
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/CreateOrganizationRequestBody'
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateOrganizationResponse'
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized access
 */
router.post("/orgs", [validateResource(createOrgRequestSchema), checkAuth0AccessToken, requireUser], createOrgHandler);

export default router;
