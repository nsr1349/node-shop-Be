const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = Schema({
        shipTo : {
            type : Object,
            required : true,
        },
        contact : {
            type : Object,
            required : true,
        },
        totalPrice : {
            type : Number,
            required : true,
        },
        userId : {
            type : mongoose.ObjectId,
            ref : User,
            required : true,
        },
        status : {
            type : String,
            default : 'preparing',
            required : true,
        },
        items : {
            type : {
                productId : {
                    type : mongoose.ObjectId,
                    ref : Product,
                    required : true
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
                price : {
                    type : Number,
                    required : true,
                }
            },
            required : true,
        }
    },
    { timestamps : true }
)

orderSchema.methods.toJSON = function () {
    const { _doc } = this
    delete _doc.updatedAt
    delete _doc.__v
    return _doc
}

const Order = mongoose.model('Order', orderSchema)

module.exports = Order