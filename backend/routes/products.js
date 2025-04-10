const express = require('express');
const {addProduct, getUserProducts} = require('../controllers/productController')
const protect = require('../middleware/auth')

const router = express.Router();

//add new product
router.post('/', protect, addProduct)

//get all products of logged in user
router.get('/', protect, getUserProducts)

module.exports = router

  