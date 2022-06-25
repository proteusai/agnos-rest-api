import { Router } from "express";
import { createMembershipHandler } from "../controllers/membership.controller";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import { createMembershipSchema } from "../schema/membership.schema";

const router = Router();

router.post(
  "/memberships",
  [validateResource(createMembershipSchema), /**checkAuth0AccessToken,**/ requireUser],
  createMembershipHandler
);

export default router;
