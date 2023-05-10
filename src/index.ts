import "module-alias/register";
import http from "http";
import https from "https";
import { Server } from "socket.io";
import config from "config";
import app from "@app";
import { connect } from "@utils/connect";
import logger from "@utils/logger";
import swaggerDocs from "@utils/swagger";
// import responseTime from "response-time";
// import { restResponseTimeHistogram, startMetricsServer } from "./utils/metrics";

const env = config.get<string>("nodeEnv");
const port = config.get<number>("port");

let server: http.Server;
if (env === "production") {
  server = https.createServer(app);
} else {
  server = http.createServer(app);
}

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

if (env !== "test") {
  server.listen(port, async () => {
    logger.info(`App is running at http://localhost:${port}`);

    await connect();

    // startMetricsServer();

    swaggerDocs(app, port);
  });

  const terminate = (server: http.Server, options = { coreDump: false, timeout: 500 }) => {
    // Exit function
    const exit = (code: number) => {
      options.coreDump ? process.abort() : process.exit(code);
    };

    return (code: number, _reason: string) => (err: Error | unknown, _promise: Promise<unknown> | unknown) => {
      if (err && err instanceof Error) {
        // Log error information, use a proper logging library here :)
        console.log(err.message, err.stack);
      }

      // Attempt a graceful shutdown
      server.close(() => exit(code));
      setTimeout(() => exit(code), options.timeout).unref();
    };
  };

  const exitHandler = terminate(server, {
    coreDump: false,
    timeout: 500,
  });

  process.on("uncaughtException", exitHandler(1, "Unexpected Error"));
  process.on("unhandledRejection", exitHandler(1, "Unhandled Promise"));
  process.on("SIGTERM", exitHandler(0, "SIGTERM"));
  process.on("SIGINT", exitHandler(0, "SIGINT"));
}
