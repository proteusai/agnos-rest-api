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

// since this endpoint allows you to fetch projects from multiple orgs, we don't need to check for org roles
router.get("/projects", [checkAuth0AccessToken, requireUser, queryParser], getProjectsHandler);

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
