const categoryModel = require("../../models/Category.js");
const GenricMethods = require("../../models/generic.js");
const QueryBuilder = require("../../models/QueryBuilder.js");
const AppError = require("../../utilities/appError.js");
const asyncCatch = require("../../utilities/asyncCatch.js");

const categoryMethods = new GenricMethods(categoryModel);

const getAllCategories = asyncCatch(async (req, res) => {
  console.log("Get api ...");

  const query = new QueryBuilder(categoryModel);
  const gategories = await query.getAll();

  res.status(200).json({
    status: "success",
    count: gategories.length,
    data: gategories,
  });
});
//get by id

//invalid id
module.exports = {
  getAllCategories,
};
