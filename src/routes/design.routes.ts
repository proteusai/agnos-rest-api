import { Router } from "express";
import { createDesignHandler } from "../controllers/design.controller";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import { createDesignSchema } from "../schema/design.schema";

const router = Router();

router.post(
  "/designs",
  [
    validateResource(createDesignSchema),
    /**checkAuth0AccessToken,**/ requireUser,
  ],
  createDesignHandler
);

export default router;
