import { Router } from "express";
import requireUser from "@middleware/requireUser";
import validateResource from "@middleware/validateResource";
import { createProjectRequestSchema, getProjectRequestSchema } from "@schemas/project";
import { createProjectHandler, getProjectHandler, getProjectsHandler } from "@controllers/project";
import checkAuth0AccessToken from "@middleware/checkAuth0AccessToken";
import queryParser from "@middleware/queryParser";

const router = Router();

router.get("/projects", [checkAuth0AccessToken, requireUser, queryParser], getProjectsHandler);

router.get(
  "/projects/:id",
  [validateResource(getProjectRequestSchema), checkAuth0AccessToken, requireUser, queryParser],
  getProjectHandler
);

router.post(
  "/projects",
  [validateResource(createProjectRequestSchema), checkAuth0AccessToken, requireUser],
  createProjectHandler
);

export default router;
