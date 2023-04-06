import { Router } from "express";
import { getMyFunctionsHandler } from "../controllers/function.controller";
import { getMyMembershipsHandler } from "../controllers/membership.controller";
import { getMyPluginsHandler } from "../controllers/plugin.controller";
import { getMyTeamHandler } from "../controllers/team.controller";
import { getMyTeamDesignSharesHandler } from "../controllers/teamDesignShare.controller";
import { getMeHandler } from "@controllers/user";
import requireUser from "../middleware/requireUser";

const router = Router();

router.get("/me", [/**checkAuth0AccessToken,**/ requireUser], getMeHandler);

router.get("/me/memberships", [/**checkAuth0AccessToken,**/ requireUser], getMyMembershipsHandler);

router.get("/me/functions", [/**checkAuth0AccessToken,**/ requireUser], getMyFunctionsHandler);

router.get("/me/plugins", [/**checkAuth0AccessToken,**/ requireUser], getMyPluginsHandler);

router.get("/me/team-designs", [/**checkAuth0AccessToken,**/ requireUser], getMyTeamDesignSharesHandler);

router.get("/me/team", [/**checkAuth0AccessToken,**/ requireUser], getMyTeamHandler);

export default router;
