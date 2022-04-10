import { Router } from "express";
import { findTeamDesignSharesForTeamHandler } from "../controllers/teamDesignShare.controller";
import requireUser from "../middleware/requireUser";

const router = Router();

router.get(
  "/share/team-designs/for-team/:team",
  [/**checkAuth0AccessToken,**/ requireUser],
  findTeamDesignSharesForTeamHandler
);

export default router;
