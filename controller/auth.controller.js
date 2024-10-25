const authController = {}
const jwt = require('jsonwebtoken')

authController.authenticate = async (req, res, next) => {
    try {
        const tokenString = req.headers.authorization 
        if (!tokenString) throw new Error('invalid token')

        const token = tokenString.replace('Bearer ', '')
        jwt.verify(token , process.env.JWT_SECRET_KEY, (err, payload) => {
            if (err) throw new Error('invalid token2')
            req.userId = payload._id
            next()
        })
    } catch ({message}) {
        res.status(400).json({status : 'fail', err : message})
    }
}

module.exports = authController