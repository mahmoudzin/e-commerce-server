const express = require("express");
const router = express.Router();
const categoriesEndPoints = require("../../api/categories");

router.get("/categories", categoriesEndPoints.getAllCategories);

module.exports = router;
