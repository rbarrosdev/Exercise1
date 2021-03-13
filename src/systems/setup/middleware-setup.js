const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const xss = require("xss-clean");
const helmet = require("helmet");
const { logger } = require("../setup/logger-setup");

const {
  addSchemas,
  addValidationFormat
} = require("../../systems/utils/schema");

module.exports = app => {
  app.use(helmet());

  app.use(cors());

  app.use(bodyParser.json());
  // app.use(express.json({ limit: '10kb' })); // Body limit is 10kb, for Preventing DOS Attacks
  app.use(bodyParser.urlencoded({ extended: false }));

  // Data sanitization against XSS
  app.use(xss());

  app.use(express.static("public"));
  app.use(
    "/",
    express.static(path.join(__dirname, "../public"), { maxAge: 31557600000 })
  );

  //path base on root, more path can be added
  addSchemas("./src/app/domains/users/schemas/*.json");
  addSchemas("./src/app/domains/productmanagement/schemas/*.json");
  addValidationFormat();

  logger.info("Middlewares setup successfull");
};
