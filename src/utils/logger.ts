import pino from "pino";
import dayjs from "dayjs";

const logger = pino({
  prettyPrint: true,
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
});

export default logger;
