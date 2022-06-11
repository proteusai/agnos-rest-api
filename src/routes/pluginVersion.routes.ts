import { Router } from "express";
import {
  createPluginVersionHandler,
  getPluginVersionHandler,
  getPluginVersionsHandler,
  updatePluginVersionHandler,
} from "../controllers/pluginVersion.controller";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import {
  createPluginVersionSchema,
  getPluginVersionSchema,
  getPluginVersionsSchema,
  updatePluginVersionSchema,
} from "../schema/pluginVersion.schema";

const router = Router();

router.get(
  "/plugin-versions/:id",
  [
    validateResource(getPluginVersionSchema),
    /**checkAuth0AccessToken,**/ requireUser,
  ],
  getPluginVersionHandler
);

router.get(
  "/plugin-versions",
  [
    validateResource(getPluginVersionsSchema),
    /**checkAuth0AccessToken,**/ requireUser,
  ],
  getPluginVersionsHandler
);

router.patch(
  "/plugin-versions/:id",
  [
    validateResource(updatePluginVersionSchema),
    /**checkAuth0AccessToken,**/ requireUser,
  ],
  updatePluginVersionHandler
);

router.post(
  "/plugin-versions",
  [
    validateResource(createPluginVersionSchema),
    /**checkAuth0AccessToken,**/ requireUser,
  ],
  createPluginVersionHandler
);

export default router;
