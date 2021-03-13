const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { logger } = require("../setup/logger-setup");

const passportSecurityStrategy = () => {
  const {
    validateUserCredentials
  } = require("../../app/domains/users/services/user.service");

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password"
      },
      async (email, password, done) => {
        try {
          const user = await validateUserCredentials(email, password);
          if (!user) {
            //Can also throw error here
            return done(null, false, {
              errors: { "email or password": "is invalid" }
            });
          }
          return done(null, user);
        } catch (e) {
          done(e);
        }
      }
    )
  );

  logger.info("Passport securtiy setup sucessfull");
};

module.exports = passportSecurityStrategy;
