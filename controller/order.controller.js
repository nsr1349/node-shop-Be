const Order = require('../model/Order')
const { randomStringGenerator } = require('../utils/randomStringGenerator')
const { checkItemListStock } = require('./product.controller')

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

orderController.getOrder = async (req, res) => {
    try {
        const { userId } = req 
        const { page, q, size, isMyOrder } = req.query

        const cond = q ? {orderNum:{$regex:q, $options:'i'}} : {}
        if (isMyOrder) cond.userId = userId

        let query = Order.find(cond)
                            .populate({
                                path : "items",
                                populate : {
                                    path : "productId",
                                    model : 'Product'
                                }
                            })
                            .sort({ createdAt: -1 })
        let response = {status : 'success' }
            
        if(page){
            query.skip((page-1)*size).limit(size)
            const totalItemNum = await Order.countDocuments(cond);
            response.totalPageNum =  Math.ceil(totalItemNum / size)
        }
    
        const orders = await query.exec()
        response.orders = orders

        res.status(200).json(response)
    } catch ({message}) {
        res.status(400).json({status : 'fail', message})
    }
}

orderController.getSingleOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
                                    .populate({
                                        path : "items",
                                        populate : {
                                            path : "productId",
                                            model : 'Product',
                                        }
                                    })
                                    .populate('userId' , 'name email', 'User')

        res.status(200).json({status : 'success', order})
    } catch ({message}) {
        res.status(400).json({status : 'fail', message})
    }
}

orderController.updateOrder = async (req, res) => {
    try {
        const { status } = req.body 
        const order = await Order.findByIdAndUpdate(
            {_id : req.params.id }, 
            { status },
            { new : true}, 
        )
        res.status(200).json({status : 'success', order})
    } catch ({message}) {
        res.status(400).json({status : 'fail', message})
    }
}

module.exports = orderController