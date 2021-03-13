const jwt = require("jsonwebtoken");
const { exceptions } = require("winston");
const { logger } = require("../setup/logger-setup");
require("../../systems/utils/arrayutility").init();

const secret = process.env.SECRET;

const checkAuthentication = (req, res, next) => {
  //this is a check for api call
  if (req.headers.authorization) {
    const token = getTokenFromHeaders(req);

    try {
      let decodedClaim = jwt.verify(token, secret);
      const currentTime = (new Date().getTime() + 1) / 1000;
      if (decodedClaim.expiration < currentTime) {
        return res.status(403).json("Invalid Token");
      }

      req.user = decodedClaim;
      req.authenticated = true;

      const isAdmin = decodedClaim.roles.hasItem("role_admin");

      if (isAdmin === true) {
        req.isAdmin = true;
      }

      next();
      return;
    } catch (error) {
      logger.warn("lib.auth.checkAuthentication: Invalid Token Access");
      res.status(403).json("Invalid Token");
      return;
    }
  }

  res.status(401).json("Unauthorized User");
};

/**
 * Array of roles the is allowed to access the route,
 * user ["authorized"] to allow the access of an autheticated user
 * @param {Array} roles
 */
const checkAuthorization = roles => {
  return (req, res, next) => {
    if (!req.authenticated) {
      throw Error("using checkAutorization with out checkAuthentication");
    }

    if (req.isAdmin) {
      next();
      return;
    }

    //check if roles given in a route handler is in the user_roles
    let handlerAllowedRoles = roles;
    const userRoles = req.user.roles;

    let match = handlerAllowedRoles.hasSameItem(userRoles);

    //The roles argument is present in user_role claims
    if (match) {
      next();
      return;
    }

    //allowing authorized use without check roles
    let allowAuthorizeUser = false;

    for (let i = 0; i < handlerAllowedRoles.length; i++) {
      if (handlerAllowedRoles[i] === "authorized") {
        allowAuthorizeUser = true;
      }
    }

    if (allowAuthorizeUser) {
      logger.info(
        "lib.auth.checkAuthentication: Im just an authenticated user"
      );
      next();
      return;
    }

    logger.warn("lib.auth.checkAuthentication: Forbiden Access");
    res.status(403).json("Forbiden");
  };
};

const checkUser = (
  claimName,
  pathVariableName /*, allowImpersonation = false */
) => {
  return (req, res, next) => {
    if (!req.authenticated) {
      throw Error("using checkAutorization with out checkAuthentication");
    }

    if (req.isAdmin) {
      next();
      return;
    }

    next();
  };
};

const getTokenFromHeaders = req => {
  const {
    headers: { authorization }
  } = req;

  if (authorization && authorization.split(" ")[0] === "Bearer") {
    return authorization.split(" ")[1];
  }
  return null;
};

module.exports = {
  checkAuthentication,
  checkAuthorization,
  checkUser,
  getTokenFromHeaders
};
