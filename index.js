const express = require('express');
const fs = require('fs')
const ejs = require('ejs')

const router = express.Router();

router.get('/', (req, res, next) => {
    fs.readFile('data.json', (err, data) => {
        if (err) throw Error
        res.render('pages/index.ejs')
    })
})

module.exports = router;