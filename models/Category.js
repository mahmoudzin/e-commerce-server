//products => {id, title, price, stock, expired_date, main_image, images: [], description, properties: [objectid]}
const mongoose = require("mongoose");
//schema
const categorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
});

//model
const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
