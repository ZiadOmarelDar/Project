const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stockQuantity: { type: Number, required: true },
  image: { type: String },
  category: { type: String, required: true, enum: ["dogs-food", "cats-food", "accessories"] }
});

const ProductModel = mongoose.model("Product", ProductSchema);

module.exports = ProductModel;
