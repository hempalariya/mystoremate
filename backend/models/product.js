const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  shopkeeper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  category: { type: String },
  mrp: { type: Number, required: true },
  costPrice: { type: Number, required: true },
  quantity: { type: Number, default: 0 },
  expiryDate: { type: Date }, 
  listedForResale: { type: Boolean, default: false },
  isNearExpiry: { type: Boolean, default: false },
  discount: { type: Number, default: 0 },
},{timestamps: true});

module.exports = mongoose.model("Product", productSchema);
 