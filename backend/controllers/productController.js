const Product = require("../models/product");

const isNearExpiry = (expiryDate) => {
  if(!expiryDate) return false
  const today = new Date()
  const expiry = new  Date(expiryDate)
  const diffInDays = (expiry - today) / (1000 * 60 * 60 * 24)
  return diffInDays <=30 && diffInDays >= 0
}


const addProduct = async (req, res) => {
  const { name, category, mrp, costPrice, quantity, expiryDate, discount } = req.body;

  try {
    const product = await Product.create({
      shopkeeper: req.user.id,
      name,
      category,
      mrp,
      costPrice,
      quantity,
      expiryDate,
      discount,
      isNearExpiry: isNearExpiry(expiryDate)
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserProducts = async (req, res) => { 
  try {
    const products = await Product.find({ shopkeeper: req.user.id });

    //update each product's isNearExpiry Field if needed
    const updatedProducts = await Promise.all(
      products.map(async (product) => {
        const shouldBeNearExpiry = isNearExpiry(product.expiryDate)
        if(product.isNearExpiry !== shouldBeNearExpiry){
          product.isNearExpiry = shouldBeNearExpiry
          await product.save()
        }
        return product
      })
    )

    res.status(200).json(updatedProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addProduct, getUserProducts }; 
