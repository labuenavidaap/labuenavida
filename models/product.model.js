const mongoose = require('mongoose')
const Comment = require('../models/comment.model')

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            minlength: [3, 'The min length is three characters'],
            trim: true
        },
        description: {
            type: String,
            required: [true, 'Description of product is required'],
            minlength: [3, 'The min length is three characters']
        },
        image: {
            type: String,
            default: 'https://res.cloudinary.com/difhe4gl3/image/upload/v1598377563/laBuenaVida/web-img/Anagrama_tgfgfa.png'
        },
        price: {
            type: String,
        },
        categories: {
            type: [String],
            enum: ['Drink', 'Food', 'Alcohol', 'Meat', 'Fruit', 'Vegetables'],
            default: [],
            required: true
        },
        producer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        stock: {
            type: Number,
            required: true,
            min: 0
        },

    },
    { timestamps: true }
)

productSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'product',
    justOne: false,
})

const Product = mongoose.model('Product', productSchema)
module.exports = Product