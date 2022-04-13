import { Router } from "express";
import { getTeamDesignSharesForTeamHandler } from "../controllers/teamDesignShare.controller";
import requireUser from "../middleware/requireUser";

const router = Router();

router.get(
  "/share/team-designs/for-team/:team?",
  [/**checkAuth0AccessToken,**/ requireUser],
  getTeamDesignSharesForTeamHandler
);

export default router;
