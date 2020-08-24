const mongoose = require("mongoose");
const Comment = require('../models/comment.model')
const Rate = require('../models/rate.model')

// name, photo, description, price, cathegory, producer, addToCart[objectId]

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        
    }
})