const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_SECURE}@test.ottu2.mongodb.net/?retryWrites=true&w=majority&appName=test`,
      {
        dbName: "e-commerce",
      }
    );
    console.log("Connect to ecommerce db");
  } catch (err) {
    console.error(err);
  }
}

module.exports = connectDB;
