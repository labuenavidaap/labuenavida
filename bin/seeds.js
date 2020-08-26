require('dotenv').config()
require("../config/db.config")
var ObjectId = require('mongodb').ObjectID


const User = require('../models/user.model')
const Comment = require('../models/comment.model')
const Product = require('../models/product.model')
const Rate = require('../models/rate.model')
const Cart = require('../models/cart.model')

// const userOne = new User({
//     name: "Fernando Marín Sánchez",
//     email: "fermarinsanchez@gmail.com",
//     password: "12345678",
//     phone: "666666666",
//     address: "13 Rue del Percebe",
//     producer: true,
//     companyName: "Jamones Guays",
//     compAddress: "Calle del Jamón 32, 28080, Madrid",
//     compMail: "hola@jamonesguays.es",
//     compPhone: "777777777",
//     compLink: "www.jamonesguays.es",
//     bio: "Los jamones mas guays del mundo entero. No son los mejores pero si los mas guays.",
//     certificates: ["Ibericos"," guays"],
//     logo: "https://www.sierradejabugo.es/wp-content/uploads/jamon-1.jpg",
//     pictures: "https://jamonalia.es/pub/media/catalog/product/cache/c687aa7517cf01e65c009f6943c2b1e9/0/6/06072-jamon-iberico-puro-pata-negra-julian-martin-guijuelo.jpg",
//     politic: true,
// })

// userOne.save()

// const userTwo = new User({
//     name: "Miguel Valle",
//     email: "mi¡guelvalle@gmail.com",
//     password: "12345679",
//     phone: "555555555",
//     address: "12 Rue del Percebe",
//     producer: true,
//     companyName: "Jamones Guays 2",
//     compAddress: "Calle del Jamón 33, 28080, Madrid",
//     compMail: "holatu@jamonesguays.es",
//     compPhone: "999999999",
//     compLink: "www.jamonesguays2.es",
//     bio: "Los jamones 2 mas guays del mundo entero. No son los mejores pero si los mas guays.",
//     certificates: ["Ibericoss"," guays del paraguay"],
//     logo: "https://www.sierradejabugo.es/wp-content/uploads/jamon-1.jpg",
//     pictures: "https://jamonalia.es/pub/media/catalog/product/cache/c687aa7517cf01e65c009f6943c2b1e9/0/6/06072-jamon-iberico-puro-pata-negra-julian-martin-guijuelo.jpg",
//     politic: true,
// })

// userTwo.save()

const product1 = new Product({
    name: 'Patatas Fritas Sabor Jamón',
    description: 'Las mejores patatas sabor jamón guay',
    img: ['https://www.elyantardeiberia.com/objetos/SN09.jpg'],
    price: 10,
    categories: ['Food'],
    producer: ObjectId('5f46a9d5425ce33ef3dcf4e7'),
    stock: 100
})

product1.save()

const product2 = new Product({
    name: 'Coca Cola Sabor Jamón',
    description: 'La mejor cocacola  sabor jamón guay',
    img: ['https://www.elyantardeiberia.com/objetos/SN09.jpg'],
    price: 3,
    categories: ['Drink'],
    producer: ObjectId('5f46a9d5425ce33ef3dcf4e7'),
    stock: 100
})

product2.save()

const product3 = new Product({
    name: 'Cerveza Sabor Jamón',
    description: 'Las mejores cervezas sabor jamón guay',
    img: ['https://www.elyantardeiberia.com/objetos/SN09.jpg'],
    price: 5,
    categories: ['Alcohol'],
    producer: ObjectId('5f46a9d5425ce33ef3dcf4e7'),
    stock: 100
})

product3.save()

const product4 = new Product({
    name: 'Paletilla Iberica',
    description: 'Paletilla de 4kg con DO Giijuelo',
    img: ['https://jamonalia.es/pub/media/catalog/product/cache/c687aa7517cf01e65c009f6943c2b1e9/0/6/06072-jamon-iberico-puro-pata-negra-julian-martin-guijuelo.jp'],
    price: 110.00,
    categories: ['Food', 'Meat'],
    producer: ObjectId('5f46ab35b812283f2d0af482'),
    stock: 10,
})

product4.save()

const product5 = new Product({
    name: 'Sandia',
    description: 'Sandia Amarilla sin pipas de 2 kgs',
    img: ['https://www.hogarmania.com/archivos/201607/salud-sandia-propiedades-1280x720x80xX.jpg'],
    price: 2.50,
    categories: ['Food', 'Fruit'],
    producer: ObjectId('5f46ab35b812283f2d0af482'),
    stock: 10,
})

product5.save()

const product6 = new Product({
    name: 'Jamón Vegano',
    description: 'Jamón VEgano, 100g',
    img: ['https://jamonalia.es/pub/media/catalog/product/cache/c687aa7517cf01e65c009f6943c2b1e9/0/6/06072-jamon-iberico-puro-pata-negra-julian-martin-guijuelo.jp'],
    price: 12.00,
    categories: ['Food', 'Vegetables'],
    producer: ObjectId('5f46ab35b812283f2d0af482'),
    stock: 10,
})

product6.save()