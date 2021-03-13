if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();

const errorhandler = require("../systems/setup/errorhandler-setup");
const middlewares = require("../systems/setup/middleware-setup");
const passposrtSecurityStratery = require("../systems/setup/security-setup");
const { setupMorgan } = require("../systems/setup/logger-setup");
const { connect } = require("../systems/setup/database-setup");

setupMorgan(app);

middlewares(app);

passposrtSecurityStratery();

require("../systems/setup/router-setup")(app);

errorhandler(app);

connect();

module.exports = app;
