const express = require("express");
const router = express.Router();
const homeController = require("../controllers/index.js");
router.get("/", homeController);

module.exports = router;
