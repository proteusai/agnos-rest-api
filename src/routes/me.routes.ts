import { Router } from "express";
import { getMyFunctionsHandler } from "../controllers/function.controller";
import { getMyTeamHandler } from "../controllers/team.controller";
import { getMeHandler } from "@controllers/user";
import requireUser from "../middleware/requireUser";
import { getMyOrgHandler } from "@controllers/org";

const router = Router();

router.get("/me", [/**checkAuth0AccessToken,**/ requireUser], getMeHandler);

router.get("/me/functions", [/**checkAuth0AccessToken,**/ requireUser], getMyFunctionsHandler);

router.get("/me/org", [/**checkAuth0AccessToken,**/ requireUser], getMyOrgHandler);

router.get("/me/team", [/**checkAuth0AccessToken,**/ requireUser], getMyTeamHandler);

export default router;
