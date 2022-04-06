import { Router } from "express";
import {
  createUserSessionHandler,
  deleteSessionHandler,
  getUserSessionsHandler,
} from "../controllers/session.controller";
import requireTrustedClient from "../middleware/requireTrustedClient";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import { createSessionSchema } from "../schema/session.schema";

const router = Router();

router.post(
  "/sessions",
  requireTrustedClient,
  validateResource(createSessionSchema),
  createUserSessionHandler
);

router.get("/sessions", requireUser, getUserSessionsHandler);

router.delete("/sessions", requireUser, deleteSessionHandler);

export default router;
