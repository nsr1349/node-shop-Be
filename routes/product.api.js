const express = require('express')
const router = express.Router()
const { authenticate,checkAdminPermission } = require('../controller/auth.controller')
const { createProduct, getProduct, updateProduct, deleteProduct, getSingleProduct } = require('../controller/product.controller')

router.post('/', authenticate, checkAdminPermission, createProduct)

router.put('/:id', authenticate, checkAdminPermission, updateProduct)

router.delete('/:id', authenticate, checkAdminPermission, deleteProduct)

router.get('/', getProduct)

router.get('/:id', getSingleProduct)

module.exports = router