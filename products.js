const express = require('express');
const fs = require('fs')

const router = express.Router();

const data = fs.readFileSync('data.json');
let products = JSON.parse(data);

router.get('/', (req, res, next) => {
    // res.status(200).json(products)
    res.render('pages/products', { products: products })
})

router.post('/food', (req, res, next) => {
    if (req.body.skladniki && req.body.nazwa && req.body.cena) {

        const food = products.jedzenie;
        let newFood = {
            _id: food.length > 0 ? Number(food[food.length - 1]._id + 1) : 1,
            nazwa: req.body.nazwa || 'Brak nazwy',
            cena: Number(req.body.cena) || 'Brak ceny',
            skladniki: Array(req.body.skladniki)
        }
        products.jedzenie.push(newFood);

        refreshProducts(products)
    }
    res.status(201).redirect('/products')
})

router.post('/drink', (req, res, next) => {
    if (req.body.nazwa && req.body.cena && req.body.pojemnosc) {
        const drinks = products.picie;
        let newDrink = {
            _id: String(Number(drinks[drinks.length - 1]._id) + 1),
            nazwa: req.body.nazwa | 'Brak nazwy',
            cena: Number(req.body.cena) | 'Brak ceny',
            pojemnosc: Number(req.body.pojemnosc)
        }
        products.picie.push(newDrink);

        refreshProducts(products)
    }
    res.status(201).redirect('/products')
})


router.get('/food/:foodId', (req, res, next) => {
    const id = req.params.foodId;
    products.jedzenie.forEach(element => {
        if (id == element._id)
            showElement(res, element);
    });
})

router.get('/drink/:drinkId', (req, res, next) => {
    const id = req.params.drinkId;
    products.picie.forEach(element => {
        if (id == element._id)
            showElement(res, element);
    });
})

function showElement(res, element) {
    res.status(200).render('pages/product', { element: element })
}

router.patch('/food/:foodId', (req, res, next) => {
    if (req.body.skladniki && req.body.nazwa && req.body.cena) {
        const id = req.params.foodId;
        products.jedzenie.forEach(element => {
            if (id == element._id)
                updateFoodElement(req, res, element);
        });
    }
})

router.patch('/drink/:drinkId', (req, res, next) => {
    if (req.body.nazwa && req.body.cena && req.body.pojemnosc) {
        const id = req.params.drinkId;
        products.picie.forEach(element => {
            if (id == element._id) {
                updateDrinkElement(req, res, element);
            }
        });
    }
})


function updateFoodElement(req, res, element) {
    if (element.nazwa != req.body.nazwa)
        element.nazwa = req.body.nazwa;
    if (element.cena != Number(req.body.cena))
        element.cena = Number(req.body.cena);
    if (element.skladniki != req.body.skladniki)
        element.skladniki = req.body.skladniki;
    element.skladniki.push('Bułka')
    refreshProducts(products);
    res.status(201).json(element)
}

function updateDrinkElement(req, res, element) {
    if (element.nazwa != req.body.nazwa)
        element.nazwa = req.body.nazwa;
    if (element.cena != Number(req.body.cena))
        element.cena = Number(req.body.cena);
    if (element.pojemnosc != Number(req.body.pojemnosc))
        element.pojemnosc = Number(req.body.pojemnosc);

    refreshProducts(products);
    res.status(201).json(element)
}

router.delete('/food/:foodId', (req, res, next) => {
    const id = req.params.foodId;
    let food = products.jedzenie;
    const index = food.findIndex((element) => {
        return element._id == id
    })
    products.jedzenie.splice(index, 1);
    refreshProducts(products)
    res.send()
})

router.delete('/drink/:drinkId', (req, res, next) => {
    const id = req.params.drinkId;
    let drinks = products.picie;
    const index = drinks.findIndex((element) => {
        return element._id == id
    })
    products.picie.splice(index, 1);
    refreshProducts(products)
    res.send()
})

function finished(err) {
    if (err) throw err
    console.log('Success!')
}

function refreshProducts(newProducts) {
    newProducts = JSON.stringify(newProducts, null, 2);
    fs.writeFileSync('data.json', newProducts, finished)
    products = JSON.parse(newProducts)
}

module.exports = router;