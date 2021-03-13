const { validateJson } = require("../../../../systems/utils/schema");
const mongoose = require("mongoose");
const AppError = require("../../../../systems/exceptions/app.error");
const HttpStatusCode = require("../../../../systems/exceptions/httpstatuscode");

const signInValidation = (req, res, next) => {
  const {
    body: { email, password }
  } = req;

  const { clientId } = req.query;

  const schemaResult = validateJson("login", {
    email,
    password
  });

  if (!schemaResult.result) {
    throw new AppError(
      "Unprocessable",
      HttpStatusCode.UNPROCESSABLE,
      true,
      schemaResult.errors[0].message
    );
  }

  if (clientId) {
    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      throw new AppError(
        "Unprocessable",
        HttpStatusCode.UNPROCESSABLE,
        true,
        "clientId is not a valid objectId"
      );
    }
  }

  next();
};

const clientRegistrationValidation = (req, res, next) => {
  const {
    body: { email, password, organizations, firstname, lastname }
  } = req;

  const schemaResult = validateJson("newClientUser", {
    email,
    password,
    organizations,
    firstname,
    lastname
  });

  if (!schemaResult.result) {
    throw new AppError(
      "Unprocessable",
      HttpStatusCode.UNPROCESSABLE,
      true,
      schemaResult.errors[0].message
    );
  }

  next();
};

const adminRegistrationValidation = (req, res, next) => {
  const {
    body: { email, organizations, firstname, lastname }
  } = req;

  const schemaResult = validateJson("newAdminUser", {
    email,
    organizations,
    firstname,
    lastname
  });

  if (!schemaResult.result) {
    throw new AppError(
      "Unprocessable",
      HttpStatusCode.UNPROCESSABLE,
      true,
      schemaResult.errors[0].message
    );
  }

  next();
};

const userIdParameterValidation = (req, res, next) => {
  const { userId } = req.params;

  if (!userId) {
    throw new AppError(
      "Unprocessable",
      HttpStatusCode.UNPROCESSABLE,
      true,
      "userId parameter is required"
    );
  }

  if (userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError(
        "Unprocessable",
        HttpStatusCode.UNPROCESSABLE,
        true,
        "userId is not a valid objectId"
      );
    }
  }

  next();
};

const updateUserValidation = (req, res, next) => {
  const {
    body: { firstname, lastname, email, roles, organizations }
  } = req;

  const schemaResult = validateJson("updateClientUser", {
    firstname,
    lastname,
    email,
    roles,
    organizations
  });

  if (!schemaResult.result) {
    throw new AppError(
      "Unprocessable",
      HttpStatusCode.UNPROCESSABLE,
      true,
      schemaResult.errors[0].message
    );
  }

  next();
};

const paginatedValidation = (req, res, next) => {
  const { page, limit } = req.query;

  if (page !== null && page < 1) {
    throw new AppError(
      "Unprocessable",
      HttpStatusCode.UNPROCESSABLE,
      true,
      "Page query parameter must not be negative or zero"
    );
  }

  if (limit !== null && limit < 1) {
    throw new AppError(
      "Unprocessable",
      HttpStatusCode.UNPROCESSABLE,
      true,
      "Limit query parameter must not be negative or zero"
    );
  }

  next();
};

module.exports = {
  signInValidation,
  clientRegistrationValidation,
  adminRegistrationValidation,
  userIdParameterValidation,
  updateUserValidation,
  paginatedValidation
};
