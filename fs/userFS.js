const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');


const readFileUser = async (email, isJson) => {
    try {
        const pathFile = path.resolve('') + '/appSistem/' + email + '/user' + (isJson ? '' : '.json')
        const result = await fs.readFile(pathFile, 'utf8');
        const jsonData = JSON.parse(result);
        return { ok: true, data: jsonData }
    } catch (e) {
        console.log(e, 'readFileUser')
        return { ok: false }
    }
}


const createFileUser = async (email, data) => {
    try {
        const pathFile = path.resolve('') + '/appSistem/' + email + '/user' + '.json'
        const dataJson = JSON.stringify(data)
        await fs.mkdir(path.resolve('') + '/appSistem/' + email, { recursive: true });
        await fs.writeFile(pathFile, dataJson)
        return { ok: true }
    } catch (e) {
        console.log(e, 'createFileUser')
        return { ok: false }
    }
}


const createToken = () => uuidv4() + '-' + Date.now();


const writeFileToken = async (email, data) => {
    try {
        const pathFile = path.resolve('') + '/appSistem/' + email + '/user' + '.json'
        const dataJson = JSON.stringify(data)
        await fs.mkdir(path.resolve('') + '/appSistem/' + email, { recursive: true });
        await fs.writeFile(pathFile, dataJson)
        return { ok: true }
    } catch (e) {
        console.log(e, 'writeFileToken')
        return { ok: false }
    }
}

// const readFileToken = async (email, isJson) => {
//     try {
//         const pathFile = path.resolve('') + '/appSistem/' + email + '/user' + (isJson ? '' : '.json')
//         const result = await fs.readFile(pathFile, 'utf8');
//         const jsonData = JSON.parse(result);
//         return { ok: true, data: jsonData }
//     } catch (e) {
//         console.log(e)
//         return { ok: false }
//     }
// }

//writeFileToken

module.exports = {
    readFileUser,
    createFileUser,
    createToken,
    writeFileToken
}