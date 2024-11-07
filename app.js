const dotenv = require('dotenv');
const express = require('express');

const userRoute = require('./routes/user/index');
const productRoute = require('./routes/product/index');

const start = async () => {
    dotenv.config();
    const app = express();
    app.use(express.json());
    app.use('/user', userRoute)
    app.use('/product', productRoute)
    const port = process.env.PORT || 3000;
    const host = process.env.HOST || '127.0.0.1';
    app.listen(port, host, () => {
        console.log(`Server running at http://${host}:${port}/product/`)
    });
}

start()


