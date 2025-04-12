const express = require('express');
const {addProduct, getUserProducts, listForResale, getAllResaleProducts, getAllNearExpiryProducts} = require('../controllers/productController')
const protect = require('../middleware/auth')

const router = express.Router();

//add new product
router.post('/', protect, addProduct)

//get all products of logged in user
router.get('/', protect, getUserProducts)


//add resale items
router.patch("/resale/:productId", protect, listForResale)

//get all the resale items
router.get('/resale', protect, getAllResaleProducts)

//get all the near expiry items
router.get('/near-expiry', protect,  getAllNearExpiryProducts)


module.exports = router

  