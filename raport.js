const express = require('express');
const fs = require('fs')

const router = express.Router();

let rawdata = fs.readFileSync('data.json');
let data = JSON.parse(rawdata);

// najtanszy burger/napoj ok
// najdrozszy burger/napoj ok
// najtanszy zestaw ok
// najdrozszy zestaw ok
// najwiecej skladnikow w burgerze ok
// najwieksza pojemnosc napoju ok
// najdluzsza nazwa burgera ok


router.get('/', (req, res, next) => {
    rawdata = fs.readFileSync('data.json');
    data = JSON.parse(rawdata);
    let wynik = {
        cheapestBurger: getCheapestElement(data.jedzenie),
        cheapestDrink: getCheapestElement(data.picie),
        mostExpensiveBurger: getMostExpensiveElement(data.jedzenie),
        mostExpensiveDrink: getMostExpensiveElement(data.picie),
        cheapestCollection: getCollection(getCheapestElement(data.jedzenie), getCheapestElement(data.picie)),
        mostExpensiveCollection: getCollection(getMostExpensiveElement(data.jedzenie), getMostExpensiveElement(data.picie)),
        longestNameBurger: getLongestNameBurger(data.jedzenie),
        greatestNumberOfIngredientsBurger: getGreatestNumberOfIngredientsBurger(data.jedzenie),
        greatestCapacityDrink: getGreatesCapacityDrink(data.picie)
    }

    res.render('pages/raport', { data: wynik })
})

router.get('/download', (req, res, next) => {
    let content =
        `Najtańszy burger: ${getCheapestElement(data.jedzenie).nazwa} - ${getCheapestElement(data.jedzenie).cena}zł` +
        `\r\nNajdroższy burger: ${getMostExpensiveElement(data.jedzenie).nazwa} - ${getMostExpensiveElement(data.jedzenie).cena}zł` +
        `\r\nNajtańszy napój: ${getCheapestElement(data.picie).nazwa} - ${getCheapestElement(data.picie).cena}zł` +
        `\r\nNajdroższy napój: ${getMostExpensiveElement(data.picie).nazwa} - ${getMostExpensiveElement(data.picie).cena}zł` +
        `\r\nNajtańszy zestaw: ${getCheapestElement(data.jedzenie).nazwa} + ${getCheapestElement(data.picie).nazwa} - ${getCollection(getCheapestElement(data.jedzenie), getCheapestElement(data.picie)).cena}zł` +
        `\r\nNajdroższy zestaw: ${getMostExpensiveElement(data.jedzenie).nazwa} + ${getMostExpensiveElement(data.picie).nazwa} - ${getCollection(getMostExpensiveElement(data.jedzenie), getMostExpensiveElement(data.picie)).cena}zł` +
        `\r\nBurger z najdłuższą nazwą: ${getLongestNameBurger(data.jedzenie).nazwa} - ${getLongestNameBurger(data.jedzenie).cena}zł` +
        `\r\nNapój z menu o największej pojemności: ${getGreatesCapacityDrink(data.picie).nazwa}, ${getGreatesCapacityDrink(data.picie).pojemnosc}L - ${getGreatesCapacityDrink(data.picie).cena}zł` +
        `\r\nBurger z największą ilością różnych składników: ${getGreatestNumberOfIngredientsBurger(data.jedzenie).nazwa} - ${getGreatestNumberOfIngredientsBurger(data.jedzenie).cena}zł\r\nSkładniki:`
    getGreatestNumberOfIngredientsBurger(data.jedzenie).skladniki.forEach(skladnik => {
        content += `\r\n* ${skladnik}`
    })
    fs.writeFileSync('raport.txt', content, (err) => console.log(err))
    res.download(`${__dirname}/raport.txt`, 'raport.txt')
})

function getCheapestElement(data) {
    let price = 9999;
    let i;
    data.forEach((element, index) => {
        if (element.cena < price) {
            price = element.cena
            i = index
        }
    });
    const obj = {
        nazwa: data[i].nazwa,
        cena: data[i].cena
    }
    return obj
}

function getMostExpensiveElement(data) {
    let price = -100;
    let i;
    data.forEach((element, index) => {
        if (element.cena > price) {
            price = element.cena
            i = index
        }
    });
    const obj = {
        nazwa: data[i].nazwa,
        cena: data[i].cena
    }
    return obj
}

function getCollection(burger, drink) {
    cena = Number(burger.cena) + Number(drink.cena)
    obj = {
        nazwaBurgera: burger.nazwa,
        nazwaPicia: drink.nazwa,
        cena: cena
    }
    return obj
}

function getLongestNameBurger(data) {
    let len = -1;
    let i;
    data.forEach((element, index) => {
        if (element.nazwa.length > len) {
            len = element.nazwa.length
            i = index
        }
    });
    const obj = {
        nazwa: data[i].nazwa,
        cena: data[i].cena,
    }
    return obj
}

function getGreatestNumberOfIngredientsBurger(data) {
    let len = -1;
    let i;
    data.forEach((element, index) => {
        if (element.skladniki.length > len) {
            len = element.skladniki.length
            i = index
        }
    });
    const obj = {
        nazwa: data[i].nazwa,
        cena: data[i].cena,
        skladniki: data[i].skladniki
    }
    return obj
}

function getGreatesCapacityDrink(data) {
    let cap = -1;
    let i;
    data.forEach((element, index) => {
        if (element.pojemnosc > cap) {
            cap = element.pojemnosc
            i = index
        }
    });
    const obj = {
        nazwa: data[i].nazwa,
        cena: data[i].cena,
        pojemnosc: data[i].pojemnosc
    }
    return obj
}

module.exports = router