const User = require('../model/User')
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userController = {}

userController.createUser = async (req, res) => {
    try {
        const { email , name, password } = req.body 
        if (!email || !name || !password ) throw new Error('모든 칸을 입력해줘')
        if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i.test(email)) throw new Error('이거 이메일 아니야')
        if (!/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/.test(name)) throw new Error('닉네임은 영어, 한글, 숫자만이야')
        if (!/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/.test(password)) throw new Error('비밀번호는 영어, 숫자 조합 8자리 이상으로..')
        const user = await User.findOne({ email })

        if (user) throw new Error('이미 가입되어 있엉')

        const newUser = new User({ 
            email , 
            name, 
            password : bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds)),
        })
        await newUser.save()

        res.status(200).json({status : 'success', data : newUser})
    } catch ({message}) {
        res.status(400).json({status : 'fail', err : message})
    }
}

userController.loginWithEmail = async (req, res) => {
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
            throw new Error('가입을 안한 것 같은데')
        }
        throw new Error('아이디나 비밀번호가 뭔가 다름')
    } catch ({message}) {
        res.status(400).json({status : 'fail', err : message})
    }
}

userController.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if (!user) throw new Error('이런 유저 없어요')
        res.status(200).json({status : 'success', user })
    } catch ({message}) {
        res.status(400).json({status : 'fail', err : message})
    }
}

module.exports = userController