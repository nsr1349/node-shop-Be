const express = require('express')
const router = express.Router()
const { authenticate } = require('../controller/auth.controller')
const { addCart, getCart, editCart, deleteCart } = require('../controller/cart.controller')

router.post('/', authenticate, addCart)

router.get('/', authenticate, getCart)

router.put('/', authenticate, editCart)

router.delete('/:id', authenticate, deleteCart)

module.exports = router