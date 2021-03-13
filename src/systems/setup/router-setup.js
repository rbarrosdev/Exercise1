const rateLimit = require("express-rate-limit");
const userController = require("../../app/domains/users/controllers/user.controller");
const customerController = require("../../app/domains/customers/controllers/customer.controller");

const { logger } = require("./logger-setup");

module.exports = app => {
  // Run on all routes
  app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-cache, no-store");
    next();
  });

  const limit = rateLimit({
    max: 30, // max requests
    windowMs: 60 * 60 * 1000, // 1 Hour
    message: "Too many requests" // message to send
  });
  //Brute force protection
  app.use("/users/client/signIn", limit); // Setting limiter on specific route

  app.use("/", userController);
  app.use("/", customerController);

  logger.info("Routes setup successfull");
};
