const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required:[true, 'Comment is required'],
        },
        photo: {
            type: String
        },
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
            required: true
        },
    },
    { timestamps: true }
)

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment