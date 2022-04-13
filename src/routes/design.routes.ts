import { Router } from "express";
import {
  createDesignHandler,
  getDesignHandler,
} from "../controllers/design.controller";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import { createDesignSchema, getDesignSchema } from "../schema/design.schema";

const router = Router();

router.get(
  "/designs/:id",
  [validateResource(getDesignSchema), /**checkAuth0AccessToken,**/ requireUser],
  getDesignHandler
);

router.post(
  "/designs",
  [
    validateResource(createDesignSchema),
    /**checkAuth0AccessToken,**/ requireUser,
  ],
  createDesignHandler
);

export default router;
