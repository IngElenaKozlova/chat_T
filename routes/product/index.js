const { Router } = require("express");
const router = Router();
const fileP = require('../../fs/productFS');
const fileU = require('../../fs/userFS');
const validation = require('../../validation/validation')

const products = {
    article_id: 'string',
    name: 'string',
    variant: 'string',
    update_date: 1235567, //UNIX
    quantity: 0,
    price: 0
}

// create    remove/:article_id update getProducts getProduct/:article_id


const isAuthorizationMiddlewar = async (req, res, next) => {
    try {
        const { email } = req.headers
        const token = req.headers.authorization?.replace("Bearer ", "")
        const responseToken = await fileU.readFileUser(email)
        if (!responseToken.data.token || responseToken.data.token !== token) return res.status(404).json({ text: 'user does not exist or token is not correct' })
        return next()
    } catch (e) {
        console.log('error')
        return res.status(405).json({ message: 'Server error' });
    }
}


router.post('/create', isAuthorizationMiddlewar, async (req, res) => {
    try {
        const { email } = req.headers
        const { article_id, name, variant, quantity, price } = req.body
        const { error } = validation.productSchema.validate(req.body);
        if (error) return res.status(421).json({ message: valid.error.details[0].message })

        const newProduct = {
            article_id: article_id,
            name: name,
            variant: variant,
            update_date: Date.now(),
            quantity: quantity,
            price: price
        }

        await fileP.addNewProduct(email, newProduct)
        return res.status(201).json({ message: "product was successfully created" })

    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "server error" })
    }
})

//'http://webSklad/reomve?_id=222&name=Alex'

router.post('/update/:article_id', isAuthorizationMiddlewar, async (req, res) => {
    try {
        const article_id = req.params.article_id; // path
        const { email } = req.headers
        const { name, variant, quantity, price } = req.body
        const { error } = validation.productSchema.validate(req.body);
        if (error) return res.status(421).json({ message: valid.error.details[0].message })

        // if (!article_id || typeof article_id !== 'string') return res.status(400).json({ message: "article_id is not correct" })
        // if (!name || typeof name !== 'string') return res.status(400).json({ message: "name is not correct" })
        // if (!variant || typeof variant !== 'string') return res.status(400).json({ message: "variant is not correct" })
        // if (Number.isNaN(quantity) || typeof quantity !== 'number') return res.status(400).json({ message: "quantity is not correct" })
        // if (Number.isNaN(price) || typeof price !== 'number') return res.status(400).json({ message: "price is not correct" })

        const userProducts = await fileP.readFileProduct(email)
        if (!userProducts.ok) return res.status(404).json({ message: "products for this user are not found" })

        const currentProduct = userProducts.data.find((elem) => {
            if (elem.article_id === article_id) return true
            else return false
        })

        if (currentProduct === undefined) return res.status(404).json({ message: "product is not found" })

        currentProduct.name = name
        currentProduct.variant = variant
        currentProduct.update_date = Date.now()
        currentProduct.quantity = quantity
        currentProduct.price = price

        await fileP.updateProduct(email, userProducts.data)
        return res.status(201).json({ message: "product was successfully updated" })

    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "server error" })
    }
})


router.get('/', isAuthorizationMiddlewar, async (req, res) => {
    try {
        const { email } = req.headers
        const d = req.body

        // const userProducts = await fileP.readFileProduct(email)

        // const isSkip = d.skip === 0 ? false : !d.skip;
        // const isCount = d.count === 0 ? false : !d.count 

        // if (isSkip || isCount ) return res.status(200).json({ data: userProducts.data }); 

        // const listOfFilteredProducts = []
        // const maxProduct = d.skip + d.count;

        // for (let i = d.skip; i < maxProduct; i++) {
        //     const product = filteredUserProducts[i]
        //     listOfFilteredProducts.push(product)           
        // }                

        // return res.status(200).json({ data: listOfFilteredProducts });

        const result = await fileP.getSlicedData(d, email)
        return res.status(200).json({data: result});

    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "server error" })
    }
})


// false less
// 'https://filter?price=10&isPrice=false&quantity=5&isQuantity=false'

// const data = {
    // min_price: 10,
    // max_price: 10,

    // min_quantity: 5,
    // max_quantity: 5
    // search : "us",
    // skip : 10,
    // count : 5
// }


router.post('/filters', isAuthorizationMiddlewar, async (req, res) => {
    try {
        const { email } = req.headers
        const d = req.body
        const searchedReq = d.search?.toLowerCase()
        const userProducts = await fileP.readFileProduct(email)

        const filteredUserProducts = userProducts.data.filter((elem) => {
            const isMinPrice = d.min_price ? d.min_price < elem.price : true;
            const isMaxPrice = d.max_price ? d.max_price > elem.price : true;
            const isMinQ = d.min_quantity ? d.min_quantity < elem.quantity : true;
            const isMaxQ = d.max_quantity ? d.max_quantity > elem.quantity : true;

            const isSearch = searchedReq ? elem.name.toLowerCase().includes(searchedReq) : true
            return isMaxPrice && isMinPrice && isMinQ && isMaxQ && isSearch
        })      

        const isSkip = d.skip === 0 ? false : !d.skip;
        const isCount = d.count === 0 ? false : !d.count 

        if (isSkip || isCount ) return res.status(200).json({ data: filteredUserProducts }); 

        const listOfFilteredProducts = []

        const maxProduct = d.skip + d.count;

        for (let i = d.skip; i < maxProduct; i++) {
            const product = filteredUserProducts[i]
            listOfFilteredProducts.push(product)           
        }                

        return res.status(200).json({ data: listOfFilteredProducts });

    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "server error" })
    }
})




router.get('/:article_id', isAuthorizationMiddlewar, async (req, res) => {
    try {
        const article_id = req.params.article_id;
        const { email } = req.headers
        const userProducts = await fileP.readFileProduct(email)

        // const currentProduct = userProducts.data.find((elem) => {
        //     if (elem.article_id === article_id) return true
        //     else return false
        // })

        const currentProduct = userProducts.data.find((elem) => elem.article_id === article_id);
        if (!currentProduct) return res.status(404).json({ message: "product is not found or was deleted" })

        return res.status(200).json({ data: currentProduct });

    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "server error" })
    }
})


router.delete('/:article_id', isAuthorizationMiddlewar, async (req, res) => {
    try {
        const article_id = req.params.article_id;
        const { email } = req.headers
        const userProducts = await fileP.readFileProduct(email)

        const userProductsNew = userProducts.data.filter((elem) => {
            return elem.article_id !== article_id
        })

        await fileP.updateProduct(email, userProductsNew)

        return res.status(200).json({ text: "product was successfully deleted", data: userProductsNew });

    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "server error" })
    }
})


module.exports = router

// const months = [1, 2, 3, 4, 3, 2, 1, 5, 3, 2]
// const newArray = months.filter((elem, i) => {
//     return elem !== 1
// })



// const arr = [
//     { _id: 1, a: 2 },
//     { _id: 2, a: 6 },
//     { _id: 3, a: 7 },
//     { _id: 4, a: 8 },
// ]

// const elem = arr.find((elem) => { /// {_id : 3, a : 7} if true or Undefined if false 
//     if (elem._id == 3) return true;
//     else return false
// })

// elem.a = 'hello';

// console.log(arr)