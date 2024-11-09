const User = require('../model/User')
const authController = {}
const jwt = require('jsonwebtoken')
const {OAuth2Client} = require('google-auth-library');
const bcrypt = require('bcrypt');

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
        res.status(400).json({status : 'fail', message})
    }
}

authController.checkAdminPermission = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId)
        if (user?.level !== 'admin') throw new Error('권한이 없습니다.')
        next()
    } catch ({message}) {
        res.status(400).json({status : 'fail', message})
    }
}


authController.loginWithEmail = async (req, res) => {
    try {
        const { email, password } = req.body 
        const user = await User.findOne({ email }).select('-__v -createdAt -updatedAt')
        if (user){
            const isMath = bcrypt.compareSync(password, user.password)
            if (isMath){
                const token = user.generateToken()
                return res.status(200).json({status : 'success', user, token})
            }
        } else {
            throw new Error('미가입자입니다')
        }
        throw new Error('아이디나 비밀번호가 다릅니다')
    } catch ({message}) {
        res.status(400).json({status : 'fail', err : message})
    }
}

authController.loginWithGoogle = async (req, res) => {
    try {
        const { token } = req.body
        const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
        const ticket = await googleClient.verifyIdToken({
            idToken : token,
            audience : process.env.GOOGLE_CLIENT_ID
        })

        const {email, name} = ticket.getPayload()
        console.log(email, name)

        let user = await User.findOne({email})
        if (!user){
            const randomPassword = ''+Math.floor(Math.random()*`1000000000`)
            const salt = await bcrypt.genSalt(10)
            const newPassword = await bcrypt.hash(randomPassword, salt)
            user = new User({
                name,
                email,
                password : newPassword
            })
            await user.save()
        }
        const sessionToken = await user.generateToken()
        res.status(200).json({status : 'success', user, token : sessionToken})
    } catch ({message}) {
        res.status(400).json({status : 'fail', err : message})
    }
}

module.exports = authController