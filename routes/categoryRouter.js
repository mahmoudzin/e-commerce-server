const express = require("express");
const router = express.Router();
const controller = require("../controllers/category.js");

const base = "/categories";
router.get(base, controller.mainView);
router.get(`${base}/create`, controller.renderCreateView);
router.get(`${base}/:id`, controller.viewSingleCategoryById);
router.get(`${base}/:id/update`, controller.renderUpdateView);
router.get(`${base}/:id/delete`, controller.deleteCategory);

router.post(
  `${base}/create`,
  controller.uploadMiddleware, //stream
  controller.createCategory
);
router.post(
  `${base}/:id/update`,
  controller.uploadMiddleware, //stream
  controller.updateCategory
);
module.exports = router;
