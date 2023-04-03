import "module-alias/register";
import http from "http";
import { Server } from "socket.io";
import config from "config";
import app from "@app";
import { connect } from "@utils/connect";
import logger from "@utils/logger";
import swaggerDocs from "@utils/swagger";
// import responseTime from "response-time";
// import { restResponseTimeHistogram, startMetricsServer } from "./utils/metrics";

const port = config.get<number>("port");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["*"],
  },
});

// app.use(
//   responseTime((req: Request, res: Response, time: number) => {
//     if (req?.route?.path) {
//       restResponseTimeHistogram.observe(
//         {
//           method: req.method,
//           route: req.route.path,
//           status_code: res.statusCode,
//         },
//         time * 1000
//       );
//     }
//   })
// );

export const websocket = io;

server.listen(0, async () => {
  logger.info(`App is running at http://localhost:${port}`);

  await connect();

  // startMetricsServer();

  swaggerDocs(app, port);
});
