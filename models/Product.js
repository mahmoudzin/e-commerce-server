const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "this field is required"],
    minLength: [3, "this field must be at least 3 characters"],
    maxLength: [50, "this field must be at most 50 characters"],
  },
  cat_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  main_image: { type: String, required: [true, "this field is required"] },
  images: [{ type: String }],
  description: {
    type: String,
    required: [true, "this field is required"],
    minLength: [50, "this field must be at least 50 characters"],
    maxLength: [250, "this field must be at most 250 characters"],
  },
  price: {
    type: Number,
    required: [true, "this field is required"],
    validate: {
      validator: function (value) {
        return value > 0;
      },
      message: "Price must be more than 0",
    },
  },
  offerPrice: {
    type: Number,
    validate: {
      validator: function (value) {
        //this
        return value < this.price;
      },
      message: "offerPrice must be less than price",
    },
  },
  stock: {
    type: Number,
    required: [true, "this field is required"],
    min: [0, "this field must be greater than 0"],
  },
  expired: {
    type: Date,
    required: [true, "this field is required"],
    validate: {
      validator: function (value) {
        return value > new Date();
      },
      message: "Expired Dat",
    },
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
