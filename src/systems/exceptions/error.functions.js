const AppError = require("./app.error");
const HttpStatusCode = require("./httpstatuscode");

const errorFunction = (name, statusCode) => message => {
  throw new AppError(name, statusCode, true, message);
};

const Error404 = errorFunction("Not Found", HttpStatusCode.NOT_FOUND);
const Error204 = errorFunction("No Content", HttpStatusCode.NO_CONTENT);

module.exports = {
  Error204,
  Error404
};
