const userModel = require("../../models/User.js");
const GenricMethods = require("../../models/generic.js");
const AppError = require("../../utilities/appError.js");
const asyncCatch = require("../../utilities/asyncCatch.js");
const userMethods = new GenricMethods(userModel);
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECERT =
  "ffa5c293f4fb4de97251c49a6ec349d7d0cc7ebe1a97055869f3703c018a8712948954e43be559a1607b352fe17b1f029911d5b3866d5e8265ed7ee4d3c79eb53d942a3019bbb440943afe15f141618348435c2385ba82d2d3b5b6a1e6256fca83211064fc1c777cd4b72eae0e5129dce5d78c53581ebcda3482a3aa5d1f5bed55d99be4aec5c61a640a487b1f619f73105ddc4b4b98f374c5731a3e416dfc704cc0bed90aa010c5a36822169f7ad4656c52f003ecbfc943450750ae9981b6017f5b967ea99daf5afb60ab4007be69adf3f3366b3eb93be1d1a61c5ecb95040c09cbc5c4426d0419a5c0e5b7b7b9a679ca921967bf62d282dcccd394ef616501";
const EXPIRES_IN = "90d";

const signup = asyncCatch(async (req, res) => {
  const isUser = await userModel.findOne({ email: req.body.email });
  if (isUser) {
    throw new AppError("this email is already in use", 400);
  }
  //hash passwoprd
  req.body.password = await bcrypt.hash(req.body.password, 12);
  const user = await userMethods.create(req.body);
  //generte token
  const token = JWT.sign({ id: user.id }, JWT_SECERT, {
    expiresIn: EXPIRES_IN,
  });
  //res.cookie
  res.status(200).json({
    status: "success",
    user,
    token,
  });
});
const logIn = asyncCatch(async (req, res) => {
  //get User by email
  const user = await userModel.findOne({ email: req.body.email });

  //check Password match Form pasword
  if (!user) {
    throw new AppError("This email does not exist!", 404);
  }
  const isPasswordMatch = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!isPasswordMatch)
    throw new AppError(
      "There seems to be an issue with either your email or your password.",
      400
    );

  //create JWT
  const token = JWT.sign({ id: user.id }, JWT_SECERT, {
    expiresIn: EXPIRES_IN,
  });
  res.status(200).json({
    status: "success",
    user,
    token,
  });
});

module.exports = {
  signup,
  logIn,
};
