const express = require('express')
const router = express.Router()
const { authenticate } = require('../controller/auth.controller')
const { addCart } = require('../controller/cart.controller')

router.post('/', authenticate, addCart)

module.exports = router