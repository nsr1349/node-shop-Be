const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const indexRouter = require('./routes/index')
require('dotenv').config()
const app = express()
const MONGODB_URI_PROD = process.env.MONGODB_URI_PROD

app.use(bodyParser.json())
app.use(cors())
app.use('/api', indexRouter)

const mongoURI = MONGODB_URI_PROD

mongoose
    .connect(mongoURI)
    .then(()=>{
        console.log('몽구스 연결')
    }).catch((err)=> {
        console.log('몽구스 연결실패', err)
    })

app.listen(process.env.PORT || 5000, ()=> {
    console.log('server on 5000')
})
