const express = require('express');
const fs = require('fs')

const router = express.Router();

let data = fs.readFileSync('data.json');
let orders = JSON.parse(data);

router.get('/', (req, res, next) => {
    data = fs.readFileSync('data.json');
    orders = JSON.parse(data);
    res.render('pages/orders', { orders: orders })
})

router.post('/', (req, res, next) => {
    let newOrder
    let data = req.body
    if (data.fname) {
        let len = Object.keys(data.fname).length
        if (typeof data.fname == 'string') {
            for (let i = 0, j = 0; i < 1; i++) {
                while (data.fcount[j] == "") {
                    j++
                }
                data.fname = data.fname + ' * ' + data.fcount[j];
                j++
            }
        }
        for (let i = 0, j = 0; i < len; i++) {
            while (data.fcount[j] == "") {
                j++
            }
            data.fname[i] = data.fname[i] + ' * ' + data.fcount[j];
            j++
        }
    }
    if (data.dname) {
        let len = Object.keys(data.dname).length
        if (typeof data.dname == 'string') {
            for (let i = 0, j = 0; i < 1; i++) {
                while (data.dcount[j] == "") {
                    j++
                }
                data.dname = data.dname + ' * ' + data.dcount[j];
                j++
            }
        }
        for (let i = 0, j = 0; i < len; i++) {
            while (data.dcount[j] == "") {
                j++
            }
            // console.log(j)
            data.dname[i] = data.dname[i] + ' * ' + data.dcount[j];
            j++
        }
    }
    if (orders.zamowienia.length > 0) {
        newOrder = {
            _id: String(Number(orders.zamowienia[orders.zamowienia.length - 1]._id) + 1),
            drinks: data.dname,
            food: data.fname
        }
    }
    else {
        newOrder = {
            _id: 1,
            drinks: data.dname,
            food: data.fname
        }
    }
    orders.zamowienia.push(newOrder)

    refreshOrders(orders)

    res.status(201).redirect('/orders')
})

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    const index = orders.zamowienia.findIndex((element) => {
        return element._id == id
    })
    orders.zamowienia.splice(index, 1);
    refreshOrders(orders)
    res.send()
})

function refreshOrders(newOrders) {
    newOrders = JSON.stringify(newOrders, null, 2);
    fs.writeFileSync('data.json', newOrders, finished)
    orders = JSON.parse(newOrders)
}

function finished(err) {
    if (err) throw err
    console.log('Success!')
}

module.exports = router;