import { Router } from "express";
import { createPluginHandler, getPluginHandler, getPluginsHandler } from "../controllers/plugin.controller";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import { createPluginSchema, getPluginSchema, getPluginsSchema } from "../schema/plugin.schema";

const router = Router();

router.get(
  "/plugins/:id",
  [validateResource(getPluginSchema), /**checkAuth0AccessToken,**/ requireUser],
  getPluginHandler
);

router.get(
  "/plugins",
  [validateResource(getPluginsSchema), /**checkAuth0AccessToken,**/ requireUser],
  getPluginsHandler
);

router.post(
  "/plugins",
  [validateResource(createPluginSchema), /**checkAuth0AccessToken,**/ requireUser],
  createPluginHandler
);

export default router;
