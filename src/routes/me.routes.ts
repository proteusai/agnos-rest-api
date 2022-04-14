import { Router } from "express";
import { getMyMembershipsHandler } from "../controllers/membership.controller";
import { getMyPluginsHandler } from "../controllers/plugin.controller";
import { getMyTeamDesignSharesHandler } from "../controllers/teamDesignShare.controller";
import { getMeHandler } from "../controllers/user.controller";
import requireUser from "../middleware/requireUser";

const router = Router();

router.get("/me", [/**checkAuth0AccessToken,**/ requireUser], getMeHandler);

router.get(
  "/me/memberships",
  [/**checkAuth0AccessToken,**/ requireUser],
  getMyMembershipsHandler
);

router.get(
  "/me/plugins",
  [/**checkAuth0AccessToken,**/ requireUser],
  getMyPluginsHandler
);

router.get(
  "/me/team-designs",
  [/**checkAuth0AccessToken,**/ requireUser],
  getMyTeamDesignSharesHandler
);

export default router;
