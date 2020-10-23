const pino = require("pino");
const logger = pino(
  {
    prettyPrint: { colorize: true },
    level: process.env.LOG_LEVEL || "info",
  },
  process.stderr
);

export default logger;
