const express = require('express')
const router = express.Router()
const { authenticate } = require('../controller/auth.controller')
const { addCart, getCart } = require('../controller/cart.controller')

router.post('/', authenticate, addCart)

router.get('/', authenticate, getCart)

module.exports = router