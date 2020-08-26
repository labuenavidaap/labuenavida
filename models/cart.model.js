const Product = require('./product.model')
const User = require('./user.model')
const mongoose = require('mongoose')


const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        products: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Products'
        },
        total: {
            type: Number
        }
    }
)

const Cart = mongoose.model('Cart', cartSchema)
module.exports = Cart
