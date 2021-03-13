const BaseError = require("./base.error").BaseError;
class AppError extends BaseError {
  constructor(
    name,
    httpCode = HttpStatusCode.INTERNAL_SERVER,
    isOperational = false,
    description = "internal server error"
  ) {
    super(name, httpCode, isOperational, description);
  }
}

module.exports = AppError;
