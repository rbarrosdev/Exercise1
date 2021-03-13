const mongoose = require("mongoose");

const mongoosePaginate = require("mongoose-paginate-v2");

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    index: true,
    unique: true,
    dropDups: true,
    required: true
  },
  passwordHash: {
    //salted and hashed using bcrypt
    type: String,
    required: true
  },
  roles: {
    type: Array
  },
  organizations: {
    type: Array
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  isDeleted: {
    type: Boolean
  }
});

userSchema.plugin(mongoosePaginate);

const User = mongoose.model("User", userSchema);

module.exports = User;
