const express = require('express')
const router = express.Router()
const { authenticate } = require('../controller/auth.controller') 
const { createOrder } = require('../controller/order.controller')

router.post('/', authenticate, createOrder)

module.exports = router