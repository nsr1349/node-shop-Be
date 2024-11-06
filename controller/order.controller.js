const Order = require('../model/Order')
const orderController = {}
const randomStringGenerator = require('../utils/randomStringGenerator')
orderController.createOrder = async (req, res) => {
    try {
        const { userId } = req 
        const { shipTo, contact, totalPrice, items } = req.body
        console.log(shipTo, contact, totalPrice, items)
        const insufficientStockItems = await checkItemListStock(items)

        if (insufficientStockItems.length > 0){
            const errorMessage = insufficientStockItems.reduce((acc, crr)=> acc + crr.message , '')
            throw new Error(errorMessage)
        }

        const newOrder = new Order({
            shipTo, 
            contact, 
            totalPrice, 
            status, 
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