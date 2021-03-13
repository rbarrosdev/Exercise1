const mongoose = require("mongoose");

const typeValidator = (message, fn) => data => {
  if (fn(data)) return data;
  else throw new TypeError(message);
};

const ifNumeric = typeValidator("Numeric type is required", data => !isNaN(data) ? true : false );

const ifObjectId = typeValidator("ObjectId type is required", data =>   mongoose.Types.ObjectId.isValid(data)? true: false )

module.exports = {
  typeValidator,
  ifNumeric,
  ifObjectId
};
