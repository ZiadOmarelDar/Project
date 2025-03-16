const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const ProductSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },  // ✅ لازم يكون required
  productName: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stockQuantity: { type: Number, required: true },
  image: { type: String },
  category: { 
    type: String, 
    required: true, 
    enum: ["dogs-food", "cats-food", "accessories"] 
  },
  type: { type: String, required: true }
}, { timestamps: true }); 

ProductSchema.plugin(AutoIncrement, { inc_field: "id" });

const ProductModel = mongoose.model("Product", ProductSchema);

module.exports = ProductModel;
