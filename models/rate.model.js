const mongoose = require('mongoose')

const rateSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        rate: {
            type: Number,
            max: 5,
            min: 1
        }
    },
    { timestamps: true }
)

const Rate = mongoose.model('Rate', rateSchema)

module.exports = Rate