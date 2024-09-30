const express = require("express");
const router = express.Router();
const userEndPoints = require("../../api/user/index.js");

router.post("/signup", userEndPoints.signup);
router.post("/signin", userEndPoints.logIn);

module.exports = router;
