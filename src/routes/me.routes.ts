import { Router } from "express";
import { findMyMembershipsHandler } from "../controllers/membership.controller";
import { findMeHandler } from "../controllers/user.controller";
import requireUser from "../middleware/requireUser";

const router = Router();

router.get("/me", [/**checkAuth0AccessToken,**/ requireUser], findMeHandler);

router.get(
  "/me/memberships",
  [/**checkAuth0AccessToken,**/ requireUser],
  findMyMembershipsHandler
);

export default router;
