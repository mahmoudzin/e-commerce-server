const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.js");

router.get("/register/signup", controller.renderSignUpView);
router.get("/register/signin", controller.renderSigninView);
router.post("/register/signup", controller.createUser);
module.exports = router;
