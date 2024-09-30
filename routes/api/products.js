const express = require("express");
const router = express.Router();
const productEndPoints = require("../../api/products");
const { uploaderFiles } = require("../../controllers/products.js");

router.get("/products", productEndPoints.getAllProducts);
router.get("/products/:id", productEndPoints.getProductById);
router.post("/products", uploaderFiles, productEndPoints.createProduct);
router.put("/products/:id", uploaderFiles, productEndPoints.updateProduct);
router.delete("/products/:id", productEndPoints.deleteProduct);

module.exports = router;
