const Product = require('./product.model')
const User = require('./user.model')
const mongoose = require('mongoose')


const wishListSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    }
)

const WishList = mongoose.model('WishList', wishListSchema)
module.exports = WishList