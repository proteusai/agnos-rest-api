import express from "express";
import config from "config";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connect from "./utils/connect";
import logger from "./utils/logger";
import routes from "./routes";
import deserializeUser from "./middleware/deserializeUser";
import swaggerDocs from "./utils/swagger";
// import responseTime from "response-time";
// import { restResponseTimeHistogram, startMetricsServer } from "./utils/metrics";

const port = config.get<number>("port");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["*"],
  },
});

app.use(express.json());

app.use(deserializeUser);

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

server.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);

  await connect();

  routes(app);

  // startMetricsServer();

  swaggerDocs(app, port);
});
