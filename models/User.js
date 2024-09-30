const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    minlength: [3, "Username must be at least 3 characters long"],
    maxlength: [30, "Username must be less than 30 characters long"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  address: {
    type: String,
    required: [true, "Address is required"],
    maxlength: [100, "Address must be less than 100 characters long"],
    trim: true,
  },
  avatar: { type: String, default: "default_image.jpg" },
  phone_number: {
    type: String,
    required: [true, "Phone number is required"],
  },
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

//1- TODO:  encrypt the password

//event
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 12);
//   next();
// });

const User = mongoose.model("User", userSchema);

module.exports = User;
