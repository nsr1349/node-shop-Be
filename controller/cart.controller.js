const Cart = require('../model/Cart')
const cartController = {}

cartController.addCart = async (req, res) => {
    console.log('ll')
    try {
        const { userId } = req
        const { productId , size, qty } = req.body
        let cart = await Cart.findOne({ userId })
        if (!cart) {
            cart = new Cart({userId})
            cart.items = [{productId, size, qty}]
            await cart.save()
            res.status(200).json({status : 'success', cart})
        }

        const existItem = cart.items.find(
            (item) => item.productId.equals(productId) && item.size === size
        )

        if (existItem) {
            throw new Error('아이템이 카트에 이미 담겨 있습니다')
        }
        cart.items = [...cart.items, {productId, size, qty}]
        await cart.save()

        res.status(200).json({status : 'success', cart})

    } catch ({message}) {
        res.status(400).json({status : 'fail', message})
    }
}

module.exports = cartController