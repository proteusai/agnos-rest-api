import { Router } from "express";
import {
  createFunctionVersionHandler,
  getFunctionVersionHandler,
  getFunctionVersionsHandler,
  runFunctionVersionHandler,
} from "../controllers/functionVersion.controller";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import {
  createFunctionVersionSchema,
  getFunctionVersionSchema,
  getFunctionVersionsSchema,
  runFunctionVersionSchema,
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

// TODO: function logs, stats (successes, failures) // do not do when ?test=true
// TODO: schedule a func to run periodically or once in the future
// TODO: a function needs permission to get data like "user", secrets etc. passed into it
// a plugin that uses this function must be granted this permission during installation

export default router;
