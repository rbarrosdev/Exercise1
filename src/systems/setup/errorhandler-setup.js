const colors = require("colors");
const { logger } = require("../setup/logger-setup");
const BaseError = require("../exceptions/base.error").BaseError;

function isTrustedError(error) {
  if (error instanceof BaseError) {
    return error.isOperational;
  }
  return false;
}

module.exports = app => {
  //must be place after all the routes
  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error("Not Found");
    // err.status = 404;
    err.httpCode = 404;
    next(err);
  });

  // development error handler
  // will print stacktrace
  if (app.get("env") === "development" || app.get("env") === "test") {
    app.use((err, req, res, next) => {
      res.status(err.httpCode || 500);

      if (isTrustedError(err)) {
        return res.json(err.message);
      }
      logger.error(err.stack);
      return res.json("DEVELOPMENT Internal Error");
    });
  }
  // production error handler
  // no stacktraces leaked to user
  app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(err.httpCode || 500);

    res.json("Prod: Internal Error");
  });

  // Nodejs version check
  const nodeVersionMajor = parseInt(
    process.version.split(".")[0].replace("v", "")
  );
  if (nodeVersionMajor < 7) {
    logger.error(
      `Please use Node.js version 7.x or above. Current version: ${nodeVersionMajor}`
    );
    process.exit(2);
  }

  app.on("uncaughtException", err => {
    logger.error(err.stack);
    process.exit(2);
  });
};
