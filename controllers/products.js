const productModel = require("../models/Product.js");
const categoryModel = require("../models/Category.js");
const GenericMethods = require("../models/generic.js");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const productMethods = new GenericMethods(productModel);
const categoryMethods = new GenericMethods(categoryModel);

const multerStoragte = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/product");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `product-${uuidv4()}.${ext}`);
  },
});

const uploader = multer({
  storage: multerStoragte,
});

const uploaderFiles = uploader.fields([
  { name: "main_image", maxCount: 1 },
  { name: "images", maxCount: 12 },
]);

const indexController = async (req, res) => {
  const products = await productMethods.getAll(
    {},
    { ref: "cat_id", fields: ["title", "description"] }
  );

  res.status(200).render("products", { products });
};

const renderCreateView = async (req, res) => {
  const categories = await categoryMethods.getAll();
  res.status(200).render("products/create", { categories });
};

const createProduct = async (req, res) => {
  const main_image = req.files["main_image"]
    ? `/images/product/${req.files["main_image"][0].filename}`
    : null;

  const images = req.files["images"]
    ? req.files["images"].map((imag) => `/images/product/${imag.filename}`)
    : [];

  const data = { ...req.body, main_image, images };
  await productMethods.create(data);
  res.status(200).redirect("/products");
};

module.exports = {
  indexController,
  renderCreateView,
  createProduct,
  uploaderFiles,
};
