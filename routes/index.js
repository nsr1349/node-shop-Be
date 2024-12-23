const express = require('express')
const router = express.Router()
const userApi = require('./user.api')
const productApi = require('./product.api')
const cartApi = require('./cart.api')
const orderApi = require('./order.api')

router.use('/user', userApi)

router.use('/product', productApi)

router.use('/cart', cartApi)

router.use('/order', orderApi)

module.exports = router