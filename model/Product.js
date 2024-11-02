const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = Schema({
        sku : {
            type : String,
            required : true,
            unique : true,
        },
        name : {
            type : String,
            required : true
        },
        image : {
            type : String,
            required : true
        },
        price : {
            type : Number,
            required : true
        },
        description: {
            type : String,
            required : true
        },
        stock: {
            type : Object,
            required : true
        },
        category: {
            type : Array,
            required : true
        },
        size: {
            type : Array,
            required : true
        },
        status: {
            type : String,
            required : true
        },
        isDeleted: {
            type : Boolean,
            required : true,
            default : false
        },
    },
    { timestamps : true }
)

productSchema.methods.toJSON = function () {
    const { _doc } = this
    delete _doc.updatedAt
    delete _doc.__v
    return _doc
}

const Product = mongoose.model('Product', productSchema)

module.exports = Product