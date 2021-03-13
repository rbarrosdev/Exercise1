const User = require("./models/user.model");
const { logger } = require("../../../../systems/setup/logger-setup");
const AppError = require("../../../../systems/exceptions/app.error");
const HttpStatusCode = require("../../../../systems/exceptions/httpstatuscode");

const getUserById = async id => {
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new AppError(
      "Not Found",
      HttpStatusCode.NOT_FOUND,
      true,
      "user data not found"
    );
  }

  return convertDataToDomainDataModel(user);
};

const getUserByEmail = async email => {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new AppError(
      "Not Found",
      HttpStatusCode.NOT_FOUND,
      true,
      "data not found"
    );
  }
  return convertDataToDomainDataModel(user);
};

const convertDataListToDomainDataModel = users => {
  const newUsers = Object.assign({}, users);
  newUsers.docs = users.docs.map(convertDataToDomainDataModel);
  return newUsers;
};

const convertDataToDomainDataModel = user => {
  const formattedUser = {
    userId: user._id,
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    organizations: user.organizations,
    roles: user.roles,
    isDeleted: user.isDeleted ? true : false,
    passwordHash: user.passwordHash
    //other information
  };

  return formattedUser;
};

const getUser = async (
  searchValue,
  page,
  limit,
  filter = [],
  sortField = ""
) => {
  let query = { $and: [] };
  query["$and"].push({
    $or: [{ isDeleted: null }, { isDeleted: false }]
  });

  if (searchValue) {
    query["$and"].push({
      $or: [
        { firstname: { $regex: searchValue, $options: "i" } },
        { lastname: { $regex: searchValue, $options: "i" } },
        { email: { $regex: searchValue, $options: "i" } }
      ]
    });
  }

  if (filter.length > 0 && Array.isArray(filter)) {
    let orFilter = { $or: [] };

    filter.forEach(f => {
      if (f.indexOf("role") > -1) {
        orFilter.$or.push({ roles: f });
      } else {
        orFilter.$or.push({ organizations: f });
      }
    });

    query["$and"].push(orFilter);
  }

  // -1 decending ; 1 = ascending
  let sort = { _id: -1 };
  if (sortField) {
    const splitSortField = sortField.split(":");
    sort = {};
    sort[splitSortField[0]] =
      splitSortField[1].toLowerCase() === "asc" ? 1 : -1;
  }

  const users = await User.paginate(query, {
    page: page,
    limit: limit,
    sort
  });

  if (users.totalDocs == 0) {
    throw new AppError(
      "Data Unavailable",
      HttpStatusCode.NO_CONTENT,
      true,
      "Data not available"
    );
  }

  return convertDataListToDomainDataModel(users);
};

const saveUser = async userData => {
  try {
    const finalUser = new User(userData);

    return await finalUser.save().then(user => {
      return convertDataToDomainDataModel(user);
    });
  } catch (e) {
    if (e.code === 11000) {
      console.info({ error: e.message });
      throw new AppError(
        "Conflict",
        HttpStatusCode.CONFLICT,
        true,
        "email registration failed"
      );
    }
    throw e;
  }
};

const updateUser = async (userId, updateData) => {
  const filter = { _id: userId };

  let user = await User.findOneAndUpdate(filter, updateData, { new: true });

  if (!user) {
    throw new AppError(
      "Not Found",
      HttpStatusCode.NOT_FOUND,
      true,
      "user data not found"
    );
  }

  return convertDataToDomainDataModel(user);
};

const markUserAsDeleted = async function(userId) {
  const updateData = {
    isDeleted: true
  };
  return await updateUser(userId, updateData);
};

const deleteUser = async userId => {
  const user = await User.findOneAndRemove({ _id: userId });

  if (user === null) {
    throw new AppError(
      "Not Found",
      HttpStatusCode.NOT_FOUND,
      true,
      "user data not found"
    );
  }
  return convertDataToDomainDataModel(user);
};

const UserMongooesRepository = {
  getUserById,
  getUserByEmail,
  getUser,
  saveUser,
  updateUser,
  deleteUser,
  markUserAsDeleted,

  convertDataListToDomainDataModel,
  convertDataToDomainDataModel
};

module.exports = UserMongooesRepository;
