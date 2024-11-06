const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('./User') 
const Product = require('./Product') 
const Cart = require('./Cart')

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
        orderNum : {
            type : String,
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
        items: [{
            productId: {
                type: mongoose.ObjectId,
                ref: Product,
                required: true
            },
            size: {
                type: String,
                required: true
            },
            qty: {
                type: Number,
                required: true,
                default: 1
            },
            price: {
                type: Number,
                required: true,
            }
        }]
    },
    { timestamps : true }
)

orderSchema.methods.toJSON = function () {
    const { _doc } = this
    delete _doc.updatedAt
    delete _doc.__v
    return _doc
}

orderSchema.post('save', async function () {
    const cart = await Cart.findOne({userId : this.userId})
    cart.items = []
    await cart.save()
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order