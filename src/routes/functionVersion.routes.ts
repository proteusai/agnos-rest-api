import { Router } from "express";
import {
  createFunctionVersionHandler,
  getFunctionVersionHandler,
  getFunctionVersionsHandler,
} from "../controllers/functionVersion.controller";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import {
  createFunctionVersionSchema,
  getFunctionVersionSchema,
  getFunctionVersionsSchema,
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

// TODO: run the function version
// router.post(
//   "/function-versions/:id",
//   [
//     validateResource(createPluginSchema),
//     /**checkAuth0AccessToken,**/ requireUser,
//   ],
//   createPluginHandler
// );

export default router;
