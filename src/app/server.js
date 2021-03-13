const server = require("./app");
const { logger } = require("../systems/setup/logger-setup");
const { connect } = require("../systems/setup/database-setup");

connect();

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  logger.info("Server start at Port : " + PORT);
  logger.debug("More detailed log", { PORT });
});

module.exports = server;
