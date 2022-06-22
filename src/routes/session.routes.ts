import { Router } from "express";
import validateResource from "../middleware/validateResource";
import requireUser from "../middleware/requireUser";
import {
  createUserSessionHandler,
  deleteSessionHandler,
  getUserSessionsHandler,
} from "../controllers/session.controller";
import { createSessionSchema } from "../schema/session.schema";
import checkAuth0IdToken from "../middleware/checkAuth0IdToken";

const router = Router();

router.post(
  "/sessions",
  [validateResource(createSessionSchema), /**checkAuth0AccessToken,**/ checkAuth0IdToken],
  createUserSessionHandler
);

router.get("/sessions", [/**checkAuth0AccessToken,**/ requireUser], getUserSessionsHandler);

router.delete("/sessions", [/**checkAuth0AccessToken,**/ requireUser], deleteSessionHandler);

export default router;
