const { createLogger, format, transports } = require("winston");
const morgan = require("morgan");

// { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
const level = process.env.LOG_LEVEL || "debug";

function formatParams(info) {
  const { timestamp, level, message, ...args } = info;
  const ts = timestamp.slice(0, 19).replace("T", " ");

  return `${ts} ${level}: ${message} ${
    Object.keys(args).length ? JSON.stringify(args, "", "") : ""
  }`;
}

const developmentFormat = format.combine(
  format.colorize(),
  format.timestamp(),
  format.align(),
  format.printf(formatParams)
);

const productionFormat = format.combine(
  format.timestamp(),
  format.align(),
  format.printf(formatParams)
);

let logger;

if (process.env.NODE_ENV !== "production") {
  logger = createLogger({
    level: level,
    format: developmentFormat,
    transports: [new transports.Console()]
  });
} else {
  logger = createLogger({
    level: level,
    format: productionFormat,
    transports: [
      new transports.File({ filename: "error.log", level: "error" }),
      new transports.File({ filename: "combined.log" })
    ]
  });
}

const setupMorgan = app => {
  const morganFormat =
    process.env.NODE_ENV !== "production" ? "dev" : "combined";
  app.use(
    morgan(morganFormat, {
      skip: function(req, res) {
        return res.statusCode < 400;
      },
      stream: process.stderr
    })
  );
  app.use(
    morgan(morganFormat, {
      skip: function(req, res) {
        return res.statusCode >= 400;
      },
      stream: process.stdout
    })
  );
};

logger.info("Logger setup successfull");

module.exports = { setupMorgan, logger };
