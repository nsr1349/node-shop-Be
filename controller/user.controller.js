const User = require('../model/User')
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userController = {}

userController.createUser = async (req, res) => {
    try {
        const { email , name, password } = req.body 
        if (!email || !name || !password ) throw new Error('빈 항목이 존재합니다')
        if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i.test(email)) throw new Error('이메일 형식을 맞춰주세요')
        if (!/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/.test(name)) throw new Error('닉네임은 영어와 한글로만 만들어주세요')
        if (!/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/.test(password)) throw new Error('비밀번호는 영어, 숫자 조합 8자리 이상으로 만들어주세요')
        const user = await User.findOne({ email })

        if (user) throw new Error('이미 가입되어 있습니다')

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
            throw new Error('미가입자입니다')
        }
        throw new Error('아이디나 비밀번호가 다릅니다')
    } catch ({message}) {
        res.status(400).json({status : 'fail', err : message})
    }
}

userController.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if (!user) throw new Error('해당 유저를 찾을 수 없습니다')
        res.status(200).json({status : 'success', user })
    } catch ({message}) {
        res.status(400).json({status : 'fail', err : message})
    }
}

module.exports = userController