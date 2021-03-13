"use strict";

const bcrypt = require("bcrypt");
const JWTgenerator = require("../../../../systems/authentication/jwtgenerator");
const UserRepository = require("../repositories/user.mongooes.repository");
const externalService = require("../external/external.service");

const AppError = require("../../../../systems/exceptions/app.error");
const HttpStatusCode = require("../../../../systems/exceptions/httpstatuscode");
require("../../../../systems/utils/arrayutility").init();

const {
  ifNumeric,
  ifObjectId
} = require("../../../../systems/utils/typevalidator");
const { composeAll, compose } = require("../../../../systems/utils/functional");

const hashThePassword = async password => {
  const hashCost = 10;
  return await bcrypt.hash(password, hashCost);
};

const createUserWithTokenGenerator = user => {
  const tokenizedUser = JWTgenerator({
    userId: user.userId,
    roles: user.roles,
    organizations: user.organizations
  });

  return tokenizedUser;
};

const getUserToken = (tokenizedUser, isAdminCall = null, clientId = null) => {
  if (clientId) {
    /* This is for impersonator */
    // console.log("impersonator");
    return {
      token: tokenizedUser
        .setExpirationHours(1)
        .setImpersonator()
        .generate(),
      userId: clientId
    };
  }

  if (isAdminCall) {
    return {
      token: tokenizedUser.setExpirationHours(24).generate(),
      userId: tokenizedUser.userId
    };
  }

  return {
    token: tokenizedUser.setExpirationHours(3).generate(),
    userId: tokenizedUser.userId
  };
};

function generateString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

const registerNewAdminUser = async function(user) {
  const { email, roles, organizations, firstname, lastname } = user;

  const newUser = {
    email: email.toLowerCase(),
    password: "newuser1", //generateString(8)
    roles,
    organizations,
    firstname,
    lastname
  };

  const userToken = registerNewUser(newUser, true);

  //consider adding employee table
  // const adminData = {
  //   email: email,
  //   firstname,
  //   lastname
  // };

  return userToken;
};

const registerNewClientUser = async user => {
  const { email, password, organizations, firstname, lastname } = user;

  const newUser = {
    email: email.toLowerCase(),
    roles: ["role_customer"],
    organizations,
    password,
    firstname,
    lastname
  };

  const userToken = await registerNewUser(newUser);

  const customerData = {
    email: newUser.email,
    firstname,
    lastname
  };

  //TODO: consider atomic transaction or async message to publish/subscribe
  await externalService.addNewCustomer(userToken.userId, customerData);

  return userToken;
};

const registerNewUser = async (user, isAdminCall = null) => {
  const getUserTokenDefined = tokenizedUser => {
    return getUserToken(tokenizedUser, isAdminCall);
  };

  const userWithHashedPassword = async user => {
    const cleanUser = Object.assign({}, user);
    cleanUser.passwordHash = await hashThePassword(user.password);
    return cleanUser;
  };

  const userToken = await compose(
    userWithHashedPassword,
    UserRepository.saveUser,
    createUserWithTokenGenerator,
    getUserTokenDefined
  )(user);

  return userToken;
};

const validateUserCredentials = async function(email, password) {
  const validatePasswordWithUserParam = async user => {
    if (await validatePassword(user, password)) return user;
  };

  const user = compose(
    UserRepository.getUserByEmail,
    validatePasswordWithUserParam
  )(email).catch(e => {
    if (e.isOperational /*&& e.httpCode === 404*/) {
      //For security purpose email not found is consider unauthorized
      throw new AppError(
        "Unauthorized",
        HttpStatusCode.UNAUTHORIZED,
        true,
        "invalid email or password"
      );
    }
  });

  return user;
};

const validatePassword = async (user, password) => {
  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) {
    throw new AppError(
      "Unauthorized",
      HttpStatusCode.UNAUTHORIZED,
      true,
      "invalid email or password"
    );
  }
  return valid;
};

const checkImpersonatorHasAccessToClientData = (
  clientId,
  impersonatorOrganization
) => {
  const checkIfClientOrgInImperatorOrg = clientUser => {
    const org =
      clientUser.organizations === undefined ? [] : clientUser.organizations;
    return org.hasSameItem(impersonatorOrganization);
  };

  let impersonatorHasAuthority = false;
  try {
    impersonatorHasAuthority = composeAll(
      ifObjectId,
      UserRepository.getUserById,
      checkIfClientOrgInImperatorOrg
    )(clientId);
  } catch (e) {
    if (e.isOperational && e.httpCode === 404) {
      //For security purpose clientId not found is considered unauthorized
      throw new AppError(
        "Forbidden",
        HttpStatusCode.FORBIDDEN,
        true,
        "user is not allowed to access data"
      );
    }
  }

  if (!impersonatorHasAuthority) {
    throw new AppError(
      "Forbidden",
      HttpStatusCode.FORBIDDEN,
      true,
      "user is not allowed to access data"
    );
  }

  return true;
};

const signedInUserAcceptance = async (
  loginUser,
  clientId = null,
  isAdminCall = true
) => {
  const getUserTokenDefined = tokenizedUser =>
    getUserToken(tokenizedUser, isAdminCall, clientId);

  if (clientId) {
    await checkImpersonatorHasAccessToClientData(
      clientId,
      loginUser.organizations
    );
  }

  const tokenizedUser = createUserWithTokenGenerator(loginUser);
  return getUserTokenDefined(tokenizedUser);
};

const getUserRequestedData = async userId => {
  ifObjectId(userId);
  return cleanDataForClient(await UserRepository.getUserById(userId));
};

const cleanDataForClient = user => {
  return {
    userId: user.userId,
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    organizations: user.organizations,
    roles: user.roles,
    isDeleted: user.isDeleted ? true : false
  };
};

function clearDataListForClient(users) {
  const newUsers = Object.assign({}, users);
  newUsers.docs = users.docs.map(cleanDataForClient);
  return newUsers;
}

const getPaginatedUserRequestedData = (
  searchvalue,
  page = 1,
  limit = 10,
  filter,
  sortField
) => {
  const validatedLimit = composeAll(ifNumeric, parseInt)(limit);

  const getUserWithDefinedLimit = page =>
    UserRepository.getUser(
      searchvalue,
      page,
      validatedLimit,
      filter,
      sortField
    );

  const users = composeAll(ifNumeric, parseInt, getUserWithDefinedLimit)(page);

  return users;
};

const updateUserData = async (userId, userData) => {
  const updateData = {
    firstname: userData.firstname,
    lastname: userData.lastname,
    email: userData.email,
    roles: userData.roles,
    organizations: userData.organizations
  };

  return await UserRepository.updateUser(userId, updateData);
};

const markUserDataAsDeleted = async function(userId) {
  return composeAll(ifObjectId, UserRepository.markUserAsDeleted)(userId);
};

module.exports = {
  getUserRequestedData,
  getPaginatedUserRequestedData,
  validateUserCredentials,
  validatePassword,
  checkImpersonatorHasAccessToClientData,
  registerNewUser,
  registerNewClientUser,
  registerNewAdminUser,
  signedInUserAcceptance,
  updateUserData,
  markUserDataAsDeleted
};
