const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter username"],
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please enter email"],
    validate: {
      validator: validator.isEmail,
      message: "Invalid Email"
    }
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
    minlength: 6
  }
});

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_LIFETIME
    }
  );
};

UserSchema.methods.checkPassword = async function (curPassword) {
  const isCorrectPassword = await bcrypt.compare(curPassword, this.password);
  return isCorrectPassword;
};

module.exports = mongoose.model("User", UserSchema);
