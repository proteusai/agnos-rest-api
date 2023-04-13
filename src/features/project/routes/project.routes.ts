import { Router } from "express";
import requireUser from "@middleware/requireUser";
import validateResource from "@middleware/validateResource";
import { createProjectRequestSchema, getProjectRequestSchema, getProjectsRequestSchema } from "@schemas/project";
import { createProjectHandler, getProjectHandler, getProjectsHandler } from "@controllers/project";
import checkAuth0AccessToken from "@middleware/checkAuth0AccessToken";

const router = Router();

router.get(
  "/projects",
  [validateResource(getProjectsRequestSchema), checkAuth0AccessToken, requireUser],
  getProjectsHandler
);

router.get(
  "/projects/:id",
  [validateResource(getProjectRequestSchema), checkAuth0AccessToken, requireUser],
  getProjectHandler
);

router.post(
  "/projects",
  [validateResource(createProjectRequestSchema), checkAuth0AccessToken, requireUser],
  createProjectHandler
);

export default router;
