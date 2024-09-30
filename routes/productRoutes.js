const express = require("express");
const router = express.Router();
const controller = require("../controllers/products.js");

const base = "/products";
router.get(base, controller.indexController);
router.get(`${base}/create`, controller.renderCreateView);
router.post(
  `${base}/create`,
  controller.uploaderFiles,
  controller.createProduct
);
module.exports = router;
