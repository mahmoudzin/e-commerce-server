const productModel = require("../../models/Product.js");
const categoryModel = require("../../models/Category.js");
const GenricMethods = require("../../models/generic.js");
const QueryBuilder = require("../../models/QueryBuilder.js");
const AppError = require("../../utilities/appError.js");
const asyncCatch = require("../../utilities/asyncCatch.js");
const productMethods = new GenricMethods(productModel);
const categoryMethods = new GenricMethods(categoryModel);

const getAllProducts = asyncCatch(async (req, res) => {
  const { cat_id, min_price, max_price } = req.query;
  let filters = {};
  if (cat_id) {
    const category = await categoryMethods.getById(cat_id);
    if (category) {
      filters.cat_id = cat_id;
    } else {
      throw new AppError("this category is not found", 404);
    }
  }
  if (min_price && !max_price) {
    filters.price = { $gte: min_price };
  } else if (max_price && !min_price) {
    filters.price = { $lte: max_price };
  } else if (min_price && max_price) {
    filters.price = { $gte: min_price, $lte: max_price };
  }

  const query = new QueryBuilder(productModel, req.query);
  const products = await query
    .filter(filters)
    .serach()
    .populate("cat_id", ["title", "description"])
    .sort()
    .pagination()
    .customizeFields()
    .getAll();
  const totalPages = await query.countAllPages();

  res.status(200).json({
    status: "success",
    count: products.length,
    pages: totalPages,
    data: products,
  });
});
//get by id

const getProductById = asyncCatch(async (req, res) => {
  const { id } = req.params;
  const product = await productMethods.getById(id);
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  res.status(200).json({
    status: "success",
    product,
  });
});
const createProduct = asyncCatch(async (req, res) => {
  const mainImage = req.files["main_image"]
    ? `/images/products/${req.files["main_image"][0].filename}`
    : null;
  const images = req.files["images"]
    ? req.files["images"].map((file) => `/images/products/${file.filename}`)
    : [];

  const data = {
    ...req.body,
    main_image: mainImage,
    images,
  };

  // const { title, description, stock, expired } = req.body;
  const product = await productMethods.create(data, {
    ref: "cat_id",
    fields: ["title", "desc"],
  });
  res.status(200).json({
    status: "success",
    product,
  });
});

const updateProduct = asyncCatch(async (req, res) => {
  const { body, files } = req;
  const { id } = req.params;
  const product = await productMethods.getById(id);
  if (!product) {
    throw new AppError("Product not found", 404);
  }
  const updatedData = { ...body };

  if (files) {
    if (files["main_image"]) {
      updatedData.main_image = `/images/products/${req.files["main_image"][0].filename}`;
    }
    if (files["images"]) {
      updateDate.images = req.files["images"].map(
        (file) => `/images/products/${file.filename}`
      );
    }
  }
  const updatedProduct = await productMethods.update(id, updatedData);
  res.status(200).json({ status: 200, product: updatedProduct });
});
const deleteProduct = asyncCatch(async (req, res) => {
  const { id } = req.params;
  const product = await productMethods.getById(id);
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  await productMethods.delete(id);
  res.status(200).json({
    status: 200,
    message: "the product has been deleted successfuly",
  });
});
//invalid id
module.exports = {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
