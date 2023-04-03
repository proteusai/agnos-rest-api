import config from "config";
import pino from "pino";
import dayjs from "dayjs";

const env = config.get<string>("nodeEnv");

const logger = pino({
  prettyPrint: true,
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
});

const loggerWrapper: Pick<typeof logger, "error" | "info" | "warn"> = {
  error: (a: unknown | object | string, b?: string | undefined, ...c: any[]) => {
    logger.error(a, b, c);
    if (env === "production") {
      // TODO: send error to sentry
    }
  },
  info: (a: unknown | object | string, b?: string | undefined, ...c: any[]) => {
    logger.info(a, b, c);
  },
  warn: (a: unknown | object | string, b?: string | undefined, ...c: any[]) => {
    logger.warn(a, b, c);
    if (env === "production") {
      // TODO: send warning to sentry
    }
  },
};

export default loggerWrapper;
