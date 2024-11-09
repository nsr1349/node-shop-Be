const express = require('express')
const router = express.Router()
const { createUser , getUser } = require('../controller/user.controller')
const { authenticate, loginWithEmail, loginWithGoogle } = require('../controller/auth.controller')

router.post('/', createUser)

router.post('/login', loginWithEmail)

router.post('/google', loginWithGoogle)

router.get('/' , authenticate, getUser)

module.exports = router