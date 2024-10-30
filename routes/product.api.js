const express = require('express')
const router = express.Router()
const { authenticate,checkAdminPermission } = require('../controller/auth.controller')
const { createProduct, getProduct } = require('../controller/product.controller')

router.post('/', authenticate, checkAdminPermission, createProduct)

router.get('/', getProduct)

module.exports = router