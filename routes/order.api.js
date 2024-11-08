const express = require('express')
const router = express.Router()
const { authenticate,checkAdminPermission } = require('../controller/auth.controller') 
const { createOrder, getOrder , getSingleOrder, updateOrder } = require('../controller/order.controller')

router.post('/', authenticate, createOrder)

router.get('/', authenticate, getOrder)

router.get('/:id', authenticate, getSingleOrder)

router.put('/:id', authenticate, checkAdminPermission, updateOrder)

module.exports = router