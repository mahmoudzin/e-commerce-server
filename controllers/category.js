const categoryModel = require("../models/Category.js");
const productModel = require("../models/Product.js");
const GenricMethgods = require("../models/generic.js");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
//cofger
//storage
const multerStoragte = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/category");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `category-${uuidv4()}.${ext}`);
  },
});

const uploader = multer({
  storage: multerStoragte,
});

const uploadMiddleware = uploader.single("image");

const categoryMethods = new GenricMethgods(categoryModel);
const proudctMethods = new GenricMethgods(productModel);

const mainView = async (req, res) => {
  //get categories
  const categories = await categoryMethods.getAll();

  res.status(200).render("categories", { categories });
};

const renderCreateView = async (req, res) => {
  res.status(200).render("categories/create");
};

const createCategory = async (req, res) => {
  const createDate = {
    ...req.body,
    image: `/images/category/${req.file.filename}`,
  };

  await categoryMethods.create(createDate);
  res.redirect("/categories");
};

const viewSingleCategoryById = async (req, res) => {
  // /categories/id
  const category_id = req.params.id;

  const category = await categoryMethods.getById(category_id);

  const products = await proudctMethods.getAll(
    { cat_id: category_id },
    { ref: "cat_id", fields: ["title"] }
  );

  res.status(200).render("categories/view", { category, products });
};

const renderUpdateView = async (req, res) => {
  const category_id = req.params.id;

  const category = await categoryMethods.getById(category_id);

  res.status(200).render("categories/update", { category });
};

const updateCategory = async (req, res) => {
  const categroy_id = req.params.id;
  const updateData = { ...req.body };

  if (req.file) {
    updateData.image = `/images/category/${req.file.filename}`;
  }

  await categoryMethods.update(categroy_id, updateData);
  res.redirect("/categories");
};

const deleteCategory = async (req, res) => {
  const cat_id = req.params.id;
  await categoryMethods.delete(cat_id);
  // replace
  await productModel.deleteMany({ cat_id: cat_id });
  // await productModel.updateMany({ cat_id: cat_id }, {cat_id:newCAtegoryId});

  res.redirect("/categories");
};

module.exports = {
  mainView,
  renderCreateView,
  createCategory,
  uploadMiddleware,
  viewSingleCategoryById,
  renderUpdateView,
  updateCategory,
  deleteCategory,
};
