const Order = require('../model/Order')
const { randomStringGenerator } = require('../utils/randomStringGenerator')
const { checkItemListStock } = require('./product.controller')
const { editCart } = require('./cart.controller')

const orderController = {}

orderController.createOrder = async (req, res) => {
    try {
        const { userId } = req 
        const { shipTo, contact, totalPrice, items } = req.body
        
        const insufficientStockItems = await checkItemListStock(items)

        if (insufficientStockItems.length > 0){
            const errorMessage = insufficientStockItems.reduce((acc, crr)=> acc + crr.message , '')
            throw new Error(errorMessage)
        }

        const newOrder = new Order({
            shipTo, 
            contact, 
            totalPrice,  
            items, 
            userId,
            orderNum : randomStringGenerator()
        })

        await newOrder.save()

        res.status(200).json({status : 'success', orderNum: newOrder.orderNum })
    } catch ({message}) {
        res.status(400).json({status : 'fail', message})
    }
}

module.exports = orderController