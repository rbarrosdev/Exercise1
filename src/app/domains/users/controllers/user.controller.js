const express = require("express");
const router = express.Router();
const passport = require("passport");
const service = require("../services/user.service");
const {
  checkAuthentication,
  checkAuthorization,
  checkUser
} = require("../../../../systems/authentication/auth");

const userValidation = require("./user.validation");

router.post(
  "/users/client/registration",
  userValidation.clientRegistrationValidation,
  async (req, res, next) => {
    try {
      const userData = req.body;

      const result = await service.registerNewClientUser(userData);

      return res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/users/admin/registration",
  userValidation.adminRegistrationValidation,
  async (req, res, next) => {
    try {
      const userData = req.body;

      const result = await service.registerNewAdminUser(userData);
      return res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/users/client/signIn",
  userValidation.signInValidation,
  (req, res, next) => {
    const { clientId } = req.query;
    return passport.authenticate(
      "local",
      { session: false },
      async (err, passportUser, info) => {
        if (err) {
          return next(err);
        }

        try {
          if (passportUser) {
            const result = await service.signedInUserAcceptance(
              passportUser,
              clientId,
              clientId !== undefined
            );

            let oneDay = new Date();
            oneDay.setHours(oneDay.getHours() + 24);

            res.cookie("token", result.token, {
              expires: oneDay,
              httpOnly: true
            });

            res.cookie("userId", JSON.stringify(result.userId), {
              expires: oneDay,
              httpOnly: true
            });

            return res.json(result);
          }

          return res.status(400).json("Invalid username or password.");
        } catch (e) {
          next(e);
        }
      }
    )(req, res, next);
  }
);

router.post("/users/signOut", (req, res) => {
  // TODO: log the users signout

  res.clearCookie("token");
  res.clearCookie("userId");

  res.sendStatus(200);
});

router.get(
  "/users/:userId",
  [
    checkAuthentication,
    checkAuthorization(["authorized"]),
    checkUser("user", "userId"),
    userValidation.userIdParameterValidation
  ],
  async (req, res, next) => {
    const { userId } = req.params;

    try {
      const result = await service.getUserRequestedData(userId);

      res.status(200).json({ user: result });
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/users/",
  [userValidation.paginatedValidation],

  async (req, res, next) => {
    const { searchValue, page, limit, filter, sortField } = req.query;

    try {
      const arFilter = filter ? filter.split(",") : [];

      const result = await service.getPaginatedUserRequestedData(
        searchValue,
        page,
        limit,
        arFilter,
        sortField
      );

      res.status(200).json({ users: result });
    } catch (e) {
      next(e);
    }
  }
);

router.put(
  "/users/:userId",
  [
    checkAuthentication,
    userValidation.userIdParameterValidation,
    userValidation.updateUserValidation
  ],
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { firstname, lastname, email, roles, organizations } = req.body;

      await service.updateUserData(userId, {
        firstname,
        lastname,
        email,
        roles,
        organizations
      });
      return res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
);

router.delete(
  "/users/:userId",
  [userValidation.userIdParameterValidation],
  async (req, res, next) => {
    try {
      const { userId } = req.params;

      await service.markUserDataAsDeleted(userId);

      return res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
