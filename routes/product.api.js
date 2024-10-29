const express = require('express')
const router = express.Router()
const { authenticate,checkAdminPermission } = require('../controller/auth.controller')
const { createProduct } = require('../controller/product.controller')

router.post('/', authenticate, checkAdminPermission, createProduct)

module.exports = router