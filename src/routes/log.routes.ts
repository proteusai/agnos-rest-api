import { Router } from "express";
import { getLogsHandler } from "../controllers/log.controller";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import { getLogsSchema } from "../schema/log.schema";

const router = Router();

router.get("/logs", [validateResource(getLogsSchema), /**checkAuth0AccessToken,**/ requireUser], getLogsHandler);

export default router;
