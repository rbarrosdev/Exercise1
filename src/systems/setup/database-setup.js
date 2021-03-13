const mongoose = require("mongoose");
const { logger } = require("../setup/logger-setup");

const databaseConfig = require("../../config/database.json");

module.exports = {
  mongoose,
  connect: () => {
    const databaseConfigEnv = databaseConfig[process.env.NODE_ENV];

    if (process.env.NODE_ENV === "production") {
      databaseConfigEnv.host = process.env.DATABASE_HOST;
      databaseConfigEnv.port = process.env.DATABASE_PORT;
      databaseConfigEnv.database = process.env.DATABASE_NAME;
      databaseConfigEnv.username = process.env.DATABASE_USERNAME;
      databaseConfigEnv.password = process.env.DATABASE_PASSWORD;
    }

    const url =
      "mongodb://" +
      databaseConfigEnv.host +
      ":" +
      databaseConfigEnv.port +
      "/" +
      databaseConfigEnv.database;

    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    mongoose.set("useFindAndModify", false);
    // (node:13118) DeprecationWarning: collection.ensureIndex is deprecated.
    // Use createIndexes instead.
    mongoose.set("useCreateIndex", true);
    mongoose.set("useNewUrlParser", true);
    mongoose.set("useUnifiedTopology", true);

    const connection = mongoose.connection;

    connection.once("open", function() {
      logger.info(
        "setup.database-setup: MongoDB database connection established successfully"
      );
    });
  },
  disconnect: done => {
    mongoose.disconnect(done);
    logger.info(
      "setup.database-setup: MongoDB database disconnected successfully"
    );
  }
};
