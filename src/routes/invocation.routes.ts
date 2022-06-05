import { Router } from "express";
import { getInvocationsHandler } from "../controllers/invocation.controller";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import { getInvocationsSchema } from "../schema/invocation.schema";

const router = Router();

router.get(
  "/invocations",
  [
    validateResource(getInvocationsSchema),
    /**checkAuth0AccessToken,**/ requireUser,
  ],
  getInvocationsHandler
);

export default router;
