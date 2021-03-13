"use strict";

const jwt = require("jsonwebtoken");
const secret = process.env.SECRET || "secret";

const JWTGenerator = function(user) {
  let expirationDate = new Date(new Date());
  let impersonated = false;
  return Object.assign({}, user, {
    // expirationDate: new Date(new Date()),
    // impersonated: false,
    setImpersonator() {
      impersonated = true;
      return this;
    },
    setExpirationHours(hour) {
      expirationDate.setHours(expirationDate.getHours() + hour);
      return this;
    },

    generate() {
      if (this.userId == undefined) {
        throw Error("userId property expected.");
      }
      if (this.roles == undefined) {
        throw Error("roles property expected.");
      }
      if (this.organizations == undefined) {
        throw Error("organizations property expected.");
      }

      let user = {
        userId: this.userId,
        roles: this.roles,
        organizations: this.organizations,
        expiration: parseInt(expirationDate.getTime() / 1000, 10)
      };

      if (impersonated) {
        user.impersonated = true;
      }

      return jwt.sign(user, secret);
    }
  });
};

module.exports = JWTGenerator;

// let gen = JWTGenerator({
//   _id: 1,
//   roles: ["admin"],
//   organizations: [],
// });

// console.dir(gen);
// console.log(gen.setExpirationHours(1).setImpersonator().generate());
