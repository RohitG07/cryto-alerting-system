const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const BadRequestError = require("../errors/bad-request");
const UnauthenticatedError = require("../errors/unauthenticated");

// SIGNUP USER
async function signup(req, res) {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    throw new BadRequestError("Please provide all fields");
  }

  const emailFound = await User.findOne({ email });
  if (emailFound) {
    throw new BadRequestError("Account already exists");
  }

  const user = await User.create({ name, email, password });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
}

// LOGIN USER
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide all fields");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Email");
  }

  const isCorrectPassword = await user.checkPassword(password);
  if (!isCorrectPassword) {
    throw new UnauthenticatedError("Invalid Password");
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
}

module.exports = { signup, login };
