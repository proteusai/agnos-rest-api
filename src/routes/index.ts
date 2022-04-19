import { Express, Request, Response } from "express";
import userRoutes from "./user.routes";
import sessionRoutes from "./session.routes";
import designRoutes from "./design.routes";
import functionRoutes from "./function.routes";
import functionVersionRoutes from "./functionVersion.routes";
import meRoutes from "./me.routes";
import membershipRoutes from "./membership.routes";
import pluginRoutes from "./plugin.routes";
import teamRoutes from "./team.routes";

export default function routes(app: Express) {
  /**
   * @openapi
   * /healthcheck:
   *  get:
   *     tags:
   *     - Healthcheck
   *     description: Responds if the app is up and running
   *     responses:
   *       200:
   *         description: App is up and running
   */
  app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));

  app.use(userRoutes);
  app.use(sessionRoutes);
  app.use(meRoutes);
  app.use(designRoutes);
  app.use(functionRoutes);
  app.use(functionVersionRoutes);
  app.use(membershipRoutes);
  app.use(pluginRoutes);
  app.use(teamRoutes);
}
