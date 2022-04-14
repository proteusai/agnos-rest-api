import { Router } from "express";
import {
  createPluginHandler,
  getPluginsHandler,
} from "../controllers/plugin.controller";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import { createPluginSchema } from "../schema/plugin.schema";

const router = Router();

router.get(
  "/plugins",
  [/**checkAuth0AccessToken,**/ requireUser],
  getPluginsHandler
);

router.post(
  "/plugins",
  [
    validateResource(createPluginSchema),
    /**checkAuth0AccessToken,**/ requireUser,
  ],
  createPluginHandler
);

export default router;
