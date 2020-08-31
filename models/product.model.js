const mongoose = require('mongoose')
const Comment = require('../models/comment.model')
const Rate = require('../models/rate.model')


const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true
        },
        description: {
            type: String,
            required: [true, 'Description of product is required'],
        },
        image: {
            type: String,
            default: 'https://res.cloudinary.com/difhe4gl3/image/upload/v1598377563/laBuenaVida/web-img/Anagrama_tgfgfa.png'
        },
        price: {
            type: Number,
            min: 0,
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
  
productSchema.virtual('likes', {
    ref: 'rate',
    localField: '_id',
    foreignField: 'product',
    justOne: false
})

const Product = mongoose.model('Product', productSchema)
module.exports = Product