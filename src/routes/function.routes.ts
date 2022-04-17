import { Router } from "express";
import {
  createFunctionHandler,
  getFunctionHandler,
  getFunctionsHandler,
} from "../controllers/function.controller";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import {
  createFunctionSchema,
  getFunctionSchema,
  getFunctionsSchema,
} from "../schema/function.schema";

const router = Router();

router.get(
  "/functions/:id",
  [
    validateResource(getFunctionSchema),
    /**checkAuth0AccessToken,**/ requireUser,
  ],
  getFunctionHandler
);

router.get(
  "/functions",
  [
    validateResource(getFunctionsSchema),
    /**checkAuth0AccessToken,**/ requireUser,
  ],
  getFunctionsHandler
);

router.post(
  "/functions",
  [
    validateResource(createFunctionSchema),
    /**checkAuth0AccessToken,**/ requireUser,
  ],
  createFunctionHandler
);

// TODO: run the latest version of this function
// router.post(
//   "/functions/:id",
//   [
//     validateResource(createPluginSchema),
//     /**checkAuth0AccessToken,**/ requireUser,
//   ],
//   createPluginHandler
// );

export default router;
