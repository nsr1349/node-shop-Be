const mongoose = require('mongoose')
const User = require('./User')
const Product = require('./Product')
const Schema = mongoose.Schema

const cartSchema = Schema({
        userId : {
            type : mongoose.ObjectId,
            ref : User,
        },
        items: {
            type : {
                productId : {
                    type : mongoose.ObjectId,
                    ref : Product
                },
                size : {
                    type : String,
                    required : true
                },
                qty : {
                    type : Number,
                    required : true,
                    default : 1
                },
            },
            require : true,
        },
    },
    { timestamps : true }
)

cartSchema.methods.toJSON = function () {
    const { _doc } = this
    delete _doc.updatedAt
    delete _doc.__v
    return _doc
}

const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart