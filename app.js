const express = require('express')
const app = express();
const path = require('path')
const ejs = require('ejs')
app.set('view engine', 'ejs');
const productRoutes = require('./products');
const ordersRoutes = require('./orders')
const indexRoutes = require('./index');
const raportRoutes = require('./raport')

const bodyParser = require('body-parser');

// parse url attributes to json data
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// prevent CORS errors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({})
    }
    next();
})

app.use(express.static(path.join(__dirname, 'public')));
// seek for paths in these folders files
app.use('/', indexRoutes)
app.use('/products', productRoutes);
app.use('/orders', ordersRoutes);
app.use('/raport', raportRoutes)

// if no route found, make some error
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app