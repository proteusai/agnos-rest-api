import { Router } from "express";
import { createOrUpdateSettingsHandler, getSettingsHandler } from "../controllers/settings.controller";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import { createSettingsSchema } from "../schema/settings.schema";

const router = Router();

router.get("/settings", [/**checkAuth0AccessToken,**/ requireUser], getSettingsHandler);

router.post(
  "/settings",
  [validateResource(createSettingsSchema), /**checkAuth0AccessToken,**/ requireUser],
  createOrUpdateSettingsHandler
);

export default router;
