import { Router } from "express";
import { getMyMembershipsHandler } from "../controllers/membership.controller";
import { getMeHandler } from "../controllers/user.controller";
import requireUser from "../middleware/requireUser";

const router = Router();

router.get("/me", [/**checkAuth0AccessToken,**/ requireUser], getMeHandler);

router.get(
  "/me/memberships",
  [/**checkAuth0AccessToken,**/ requireUser],
  getMyMembershipsHandler
);

export default router;
