import { Router } from "express";
import {
  createFunctionVersionHandler,
  getFunctionVersionHandler,
  getFunctionVersionsHandler,
  runFunctionVersionHandler,
  updateFunctionVersionHandler,
} from "../controllers/functionVersion.controller";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import {
  createFunctionVersionSchema,
  getFunctionVersionSchema,
  getFunctionVersionsSchema,
  runFunctionVersionSchema,
  updateFunctionVersionSchema,
} from "../schema/functionVersion.schema";

const router = Router();

router.get(
  "/function-versions/:id",
  [
    validateResource(getFunctionVersionSchema),
    /**checkAuth0AccessToken,**/ requireUser,
  ],
  getFunctionVersionHandler
);

router.get(
  "/function-versions",
  [
    validateResource(getFunctionVersionsSchema),
    /**checkAuth0AccessToken,**/ requireUser,
  ],
  getFunctionVersionsHandler
);

router.patch(
  "/function-versions/:id",
  [
    validateResource(updateFunctionVersionSchema),
    /**checkAuth0AccessToken,**/ requireUser,
  ],
  updateFunctionVersionHandler
);

router.post(
  "/function-versions",
  [
    validateResource(createFunctionVersionSchema),
    /**checkAuth0AccessToken,**/ requireUser,
  ],
  createFunctionVersionHandler
);

router.post(
  "/function-versions/:id",
  [
    validateResource(runFunctionVersionSchema),
    /**checkAuth0AccessToken,**/ requireUser,
  ],
  runFunctionVersionHandler
);

// TODO: schedule a func to run periodically or once in the future
// a plugin that uses this function must be granted this permission during installation

export default router;
