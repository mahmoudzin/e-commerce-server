const JWT = require("jsonwebtoken");
const GenericMethods = require("../models/generic.js");
const userModel = require("../models/User.js");
const { JWT_SECERT } = require("../controllers/user.js");
const AppError = require("../utilities/appError.js");

const userMethods = new GenericMethods(userModel);

const protectedMVCRoutes = async (req, res, next) => {
  try {
    //1- check if token is exist
    const token = req.cookies.token;
    console.log("token => ", token);

    //2- verfy token
    const { id } = JWT.verify(token, JWT_SECERT);

    //3- check if user still exist
    const user = await userMethods.getById(id);

    if (!user || user.role !== "admin") {
      return res.status(401).render("error", {
        message: "401 You are not authorized to access this",
        back_url: "/register/signup",
      });
    }

    next();
  } catch (e) {
    res.status(401).render("error", {
      message: "401 You are not authorized to access this",
      back_url: "/register/signup",
    });
  }
};

const protectedAPIRoutes = async (req, res, next) => {
  try {
    //1- check if token is exist
    let token = req.headers.authorization;
    token = token && token.split(" ")[1];
    if (!token) {
      throw new AppError("401 You are not authorized to access this", 401);
    }

    //2- verfy token
    const { id } = JWT.verify(token, JWT_SECERT);

    //3- check if user still exist
    const user = await userMethods.getById(id);

    if (!user) {
      throw new AppError("401 You are not authorized to access this", 401);
    }
    next();
  } catch (e) {
    next(e);
  }
};

module.exports = { protectedMVCRoutes, protectedAPIRoutes };
