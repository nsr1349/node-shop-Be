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

productController.getProduct = async (req, res) => {
    try {
        const { page, q, size, active } = req.query
        const cond = q ? {name:{$regex:q, $options:'i'}, isDeleted : false} : {}
        cond.isDeleted = false
        if (active === 'true') cond.status = 'active'
            
        let query = Product.find(cond).sort({ createdAt: -1 })
        let response = {status : 'success' }
            
        if(page){
            query.skip((page-1)*size).limit(size)
            const totalItemNum = await Product.countDocuments(cond);
            response.totalPageNum =  Math.ceil(totalItemNum / size)
        }
    
        const products = await query.exec()
        response.products = products
            
        res.status(200).json(response)
    } catch ({message}) {
        res.status(400).json({status : 'fail', message})
    }
}

productController.getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        res.status(200).json({status : 'success', product})
    } catch ({message}) {
        res.status(400).json({status : 'fail', message})
    }
}


productController.updateProduct = async (req, res) => {
    try {
        const { sku , name, size, image, category, description, price, stock, status} = req.body 
        console.log(size)
        const product = await Product.findByIdAndUpdate(
            {_id : req.params.id }, 
            { sku , name, size, image, category, description, price, stock, status},
            { new : true}, 
        )
        if (!product) throw new Error('수정하려는 상품을 찾을 수 없습니다')

        res.status(200).json({ status : 'success', product })
    } catch ({message}) {
        res.status(400).json({ status : 'fail', message })
    }
}

productController.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            {_id : req.params.id }, 
            { isDeleted : true },
            { new : true}, 
        )
        console.log(req.params.id)
        if (!product) throw new Error('삭제하려는 상품을 찾을 수 없습니다')

        res.status(200).json({ status : 'success', product })
    } catch ({message}) {
        res.status(400).json({ status : 'fail', message })
    }
}


productController.checkStock = async (item) => {
        const product = await Product.findById(item.productId)

        if (product.stock[item.size] < item.qty){
            return { isVerify : false,  message : `${product.name} 의 ${item.size} 재고가 부족합니다.` }
        }

        const newStock = {...product.stock}
        newStock[item.size] -= item.qty
        product.stock = newStock
        await product.save()
        return { isVerify : true }
}


productController.checkItemListStock = async (itemList) => {
        const insufficientStockItems = []
        
        await Promise.all(
            itemList.map( async (item)=> {
                const stockCheck = await productController.checkStock(item)
                if (!stockCheck.isVerify) {
                    insufficientStockItems.push({item, message : stockCheck.message })
                }
                return stockCheck
            })
        )
        return insufficientStockItems
}


module.exports = productController