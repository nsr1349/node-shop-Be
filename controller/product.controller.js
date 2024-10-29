const Product = require('../model/Product')
const productController = {}

productController.createProduct = async (req, res) => {
    try {
        const { sku , name, size, image, category, description, price, stock, status} = req.body 
        const product = new Product({sku , name, size, image, category, description, price, stock, status})
        await product.save()
        
        res.status(200).json({status : 'success', product })
    } catch ({message}) {
        res.status(400).json({status : 'fail', message})
    }
}

module.exports = productController