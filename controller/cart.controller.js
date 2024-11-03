const Cart = require('../model/Cart')
const cartController = {}

cartController.addCart = async (req, res) => {
    try {
        const { userId } = req
        const { productId , size, qty } = req.body
        let cart = await Cart.findOne({ userId })
        if (!cart) {
            cart = new Cart({userId})
            cart.items = []
        }

        const existItem = cart.items.find(
            (item) => item.productId.equals(productId) && item.size === size
        )

        if (existItem) {
            throw new Error('아이템이 카트에 이미 담겨 있습니다')
        }
        cart.items = [...cart.items, {productId, size, qty}]
        await cart.save()

        res.status(200).json({status : 'success', cart })

    } catch ({message}) {
        res.status(400).json({status : 'fail', message})
    }
}

cartController.getCart = async (req, res) => {
    try {
        const { userId } = req
        const cart = await Cart.findOne({ userId }).populate({
            path : "items",
            populate : {
                path : "productId",
                model : 'Product'
            }
        })
        res.status(200).json({status : 'success', cart})
    } catch ({message}) {
        res.status(400).json({status : 'fail', message})
    }
}

cartController.editCart = async (req, res) => {
    try {
        const { userId } = req
        const { items } = req.body

        const cart = await Cart.findOneAndUpdate(
            { userId }, 
            { items },
        ).populate({
            path : "items",
            populate : {
                path : "productId",
                model : 'Product'
            }
        })

        await cart.save();
        res.status(200).json({status : 'success', cart})
    } catch ({message}) {
        res.status(400).json({status : 'fail', message})
    }
}

cartController.deleteCart = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req;
        const cart = await Cart.findOne({ userId });
        cart.items = cart.items.filter((item) => !item._id.equals(id));

        await cart.save();
        res.status(200).json({status : 'success', cart})
    } catch (error) {
        res.status(400).json({status : 'fail', message})
    }
};

module.exports = cartController