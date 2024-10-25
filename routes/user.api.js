const express = require('express')
const router = express.Router()
const { createUser, loginWithEmail , getUser } = require('../controller/user.controller')
const { authenticate } = require('../controller/auth.controller')

router.post('/', createUser)

router.post('/login', loginWithEmail)

router.get('/' , authenticate, getUser)

module.exports = router