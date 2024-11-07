const fs = require('fs').promises;
const path = require('path');
// const { v4: uuidv4 } = require('uuid');


const readFileProduct = async (email, isJson) => {
    try {
        const pathFile = path.resolve('') + '/appSistem/' + email + '/products' + (isJson ? '' : '.json')
        const result = await fs.readFile(pathFile, 'utf8');
        const jsonData = JSON.parse(result);
        return { ok: true, data: jsonData }
    } catch (e) {
        console.log(e, 'readFileProduct')
        return { ok: false }
    }
}


const createFileProduct = async (email, data) => {
    try {
        const pathFile = path.resolve('') + '/appSistem/' + email + '/products' + '.json';
        const dataJson = JSON.stringify(data)
        await fs.mkdir(path.resolve('') + '/appSistem/' + email, { recursive: true });
        await fs.writeFile(pathFile, dataJson)
        return { ok: true }
    } catch (e) {
        console.log(e, 'createFileProduct')
        return { ok: false }
    }
}


const addNewProduct = async (email, data) => {
    try {
        const responseProduct = await readFileProduct(email)

        if (responseProduct.ok) {
            const products = responseProduct.data;
            products.push(data)
            createFileProduct(email, products)
        } else {
            createFileProduct(email, [data])
        }
        return { ok: true }

    } catch (e) {
        console.log(e, 'addNewProduct')
        return { ok: false }
    }
}


const updateProduct = async (email, data) => {
    try {
        createFileProduct(email, data)
        return { ok: true }

    } catch (e) {
        console.log(e, 'updateProduct')
        return { ok: false }
    }
}


const getSlicedData = async ({skip, count}, email) => {
    try{
        const isSkip = skip === 0 ? false : !skip;
        const isCount = count === 0 ? false : !count 
        if (isSkip || isCount ) return {ok : false}

        const userProducts = await readFileProduct(email)

        const listOfFilteredProducts = []
        const maxProduct = skip + count;

        for (let i = skip; i < maxProduct; i++) {
            const product = userProducts.data[i]
            listOfFilteredProducts.push(product)           
        }                

        return listOfFilteredProducts
    } catch (e) {
        console.log(e, 'getSlicedData')
        return { ok: false }
    }
}


module.exports = {
    readFileProduct,
    createFileProduct,
    addNewProduct,
    updateProduct,
    getSlicedData
}